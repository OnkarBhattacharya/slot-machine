const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

const db = admin.firestore();

const RATE_WINDOW_MS = 60 * 1000;
const MAX_SPINS_PER_WINDOW = 120;
const MAX_PURCHASE_CHECKS_PER_WINDOW = 20;
const MAX_PAYOUT_MULTIPLIER = 2000;
const REQUEST_SIGNING_KEY = process.env.REQUEST_SIGNING_KEY || '';
const REQUEST_TTL_MS = 2 * 60 * 1000;

async function enforceRateLimit(uid, action, limitPerWindow) {
  const ref = db.collection('rate_limits').doc(`${uid}_${action}`);
  const snapshot = await ref.get();
  const now = Date.now();

  let count = 0;
  let resetAt = now + RATE_WINDOW_MS;

  if (snapshot.exists) {
    const data = snapshot.data();
    if (typeof data.resetAt === 'number' && data.resetAt > now) {
      count = data.count || 0;
      resetAt = data.resetAt;
    }
  }

  if (count >= limitPerWindow) {
    throw new HttpsError('resource-exhausted', 'Rate limit exceeded');
  }

  await ref.set(
    {
      count: count + 1,
      resetAt
    },
    { merge: true }
  );
}

function verifySignedRequest(signed) {
  if (!REQUEST_SIGNING_KEY) {
    return signed?.payload || signed || {};
  }

  const signature = signed?.signature;
  const nonce = signed?.nonce;
  const timestamp = Number(signed?.timestamp || 0);
  const payload = signed?.payload || {};

  if (!signature || !nonce || !timestamp) {
    throw new HttpsError('invalid-argument', 'Missing request signature fields');
  }

  if (Math.abs(Date.now() - timestamp) > REQUEST_TTL_MS) {
    throw new HttpsError('invalid-argument', 'Expired request timestamp');
  }

  const payloadHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex');

  const expected = crypto
    .createHmac('sha256', REQUEST_SIGNING_KEY)
    .update(`${timestamp}.${nonce}.${payloadHash}`)
    .digest('hex');

  if (expected !== signature) {
    throw new HttpsError('permission-denied', 'Invalid request signature');
  }

  return payload;
}

exports.validateSpin = onCall(async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  await enforceRateLimit(request.auth.uid, 'spin', MAX_SPINS_PER_WINDOW);

  const payload = verifySignedRequest(request.data);

  const {
    payout = 0,
    jackpotWin = 0,
    betAmount = 0,
    reels = [],
    machineId = '',
    isJackpot = false
  } = payload || {};

  if (!Array.isArray(reels) || reels.length !== 3) {
    throw new HttpsError('invalid-argument', 'Spin payload is malformed');
  }

  if (!Number.isFinite(betAmount) || betAmount <= 0) {
    throw new HttpsError('invalid-argument', 'Invalid bet amount');
  }

  if (!Number.isFinite(payout) || payout < 0) {
    throw new HttpsError('invalid-argument', 'Invalid payout');
  }

  if (!Number.isFinite(jackpotWin) || jackpotWin < 0) {
    throw new HttpsError('invalid-argument', 'Invalid jackpot payout');
  }

  const maxPayout = betAmount * MAX_PAYOUT_MULTIPLIER;
  const normalizedPayout = Math.min(payout, maxPayout);

  const suspicious =
    payout > maxPayout ||
    jackpotWin > maxPayout * 2 ||
    (isJackpot && jackpotWin <= 0) ||
    typeof machineId !== 'string' ||
    machineId.length > 40;

  if (suspicious) {
    await db.collection('fraud_events').add({
      uid: request.auth.uid,
      type: 'spin_anomaly',
      machineId: machineId || null,
      payout,
      jackpotWin,
      betAmount,
      reels,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  return {
    valid: !suspicious,
    payout: normalizedPayout,
    jackpotWin: suspicious ? 0 : jackpotWin
  };
});

exports.verifyPurchase = onCall(async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  await enforceRateLimit(request.auth.uid, 'purchase_verify', MAX_PURCHASE_CHECKS_PER_WINDOW);

  const payload = verifySignedRequest(request.data);
  const { productId, type = 'unknown', platform = 'unknown' } = payload || {};
  if (!productId || typeof productId !== 'string') {
    throw new HttpsError('invalid-argument', 'Missing product ID');
  }

  // TODO: Replace with RevenueCat server-side API verification.
  const looksValid = /^[a-z0-9_./-]+$/i.test(productId) && productId.length <= 100;

  if (!looksValid) {
    await db.collection('fraud_events').add({
      uid: request.auth.uid,
      type: 'purchase_anomaly',
      productId,
      platform,
      purchaseType: type,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  return { verified: looksValid };
});
