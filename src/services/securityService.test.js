import { SecurityService } from './securityService';
import { Storage } from '../utils/storage';

describe('SecurityService', () => {
  beforeEach(() => {
    Storage.clear();
  });

  test('encrypt/decrypt roundtrip preserves object', () => {
    const payload = { coins: 1200, level: 3 };
    const encrypted = SecurityService.encrypt(payload);
    const decrypted = SecurityService.decrypt(encrypted);

    expect(typeof encrypted).toBe('string');
    expect(decrypted).toEqual(payload);
  });

  test('saveSecure/loadSecure rejects tampered value', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    SecurityService.saveSecure('coins_secure', 1500);
    Storage.save('coins_secure', 'tampered_payload');

    const loaded = SecurityService.loadSecure('coins_secure', 1000);
    expect(loaded).toBe(1000);
    errorSpy.mockRestore();
  });

  test('checkRateLimit blocks after max attempts', () => {
    expect(SecurityService.checkRateLimit('spin', 2, 60000)).toBe(true);
    expect(SecurityService.checkRateLimit('spin', 2, 60000)).toBe(true);
    expect(SecurityService.checkRateLimit('spin', 2, 60000)).toBe(false);
  });

  test('signed requests validate and fail after payload tampering', () => {
    const signed = SecurityService.getSignedRequest({ payout: 200 });
    expect(SecurityService.verifySignedRequest(signed)).toBe(true);

    const tampered = { ...signed, payload: { payout: 9999 } };
    expect(SecurityService.verifySignedRequest(tampered)).toBe(false);
  });
});
