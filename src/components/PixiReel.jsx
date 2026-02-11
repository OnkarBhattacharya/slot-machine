import React, { useEffect, useRef } from 'react';
import { Application, Assets, BlurFilter, Container, Graphics, Sprite } from 'pixi.js';
import { AdvancedBloomFilter, GlowFilter } from 'pixi-filters';
import { getSymbolAsset } from '../utils/gameConfig';

const REEL_WIDTH = 104;
const REEL_HEIGHT = 124;

function PixiReel({ symbol, isSpinning, isWinning, highlight }) {
  const hostRef = useRef(null);
  const appRef = useRef(null);
  const spriteRef = useRef(null);
  const blurRef = useRef(null);
  const frameRef = useRef(null);
  const spinPhaseRef = useRef(0);
  const isSpinningRef = useRef(isSpinning);
  const isWinningRef = useRef(isWinning);
  const highlightRef = useRef(highlight);
  const symbolRef = useRef(symbol);
  const textureRequestIdRef = useRef(0);
  const mountedRef = useRef(false);

  const drawFrame = (frame, isActiveHighlight) => {
    frame.clear();
    if (isActiveHighlight) {
      frame.roundRect(2, 2, REEL_WIDTH - 4, REEL_HEIGHT - 4, 16).stroke({ width: 3, color: 0xfacc15, alpha: 0.85 });
      return;
    }
    frame.roundRect(2, 2, REEL_WIDTH - 4, REEL_HEIGHT - 4, 16).stroke({ width: 2, color: 0xe2e8f0, alpha: 0.42 });
  };

  const applyWinningFilters = () => {
    const sprite = spriteRef.current;
    const frame = frameRef.current;
    const blur = blurRef.current;
    if (!sprite || !frame) return;

    if (isWinningRef.current && highlightRef.current) {
      sprite.filters = [
        blur,
        new GlowFilter({ distance: 18, outerStrength: 2.4, color: 0xfacc15 }),
        new AdvancedBloomFilter({ threshold: 0.25, bloomScale: 0.8, brightness: 1.2, blur: 6 })
      ].filter(Boolean);
      drawFrame(frame, true);
      return;
    }

    sprite.filters = [blur].filter(Boolean);
    drawFrame(frame, false);
  };

  const applyTexture = async (nextSymbol) => {
    const sprite = spriteRef.current;
    if (!sprite) return;

    const src = getSymbolAsset(nextSymbol);
    if (!src) return;

    const requestId = ++textureRequestIdRef.current;
    const texture = await Assets.load(src);

    if (!mountedRef.current || requestId !== textureRequestIdRef.current) return;
    if (!spriteRef.current || spriteRef.current.destroyed) return;

    const liveSprite = spriteRef.current;
    liveSprite.texture = texture;

    const maxWidth = REEL_WIDTH - 28;
    const maxHeight = REEL_HEIGHT - 28;
    const scale = Math.min(maxWidth / texture.width, maxHeight / texture.height);
    liveSprite.scale.set(scale);
  };

  useEffect(() => {
    mountedRef.current = true;
    let active = true;
    const host = hostRef.current;
    if (!host) return undefined;

    const setup = async () => {
      const app = new Application();
      await app.init({
        width: REEL_WIDTH,
        height: REEL_HEIGHT,
        antialias: true,
        backgroundAlpha: 0,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2)
      });

      if (!active) {
        app.destroy(true, { children: true, texture: false });
        return;
      }

      host.innerHTML = '';
      host.appendChild(app.canvas);
      appRef.current = app;

      const root = new Container();
      app.stage.addChild(root);

      const panel = new Graphics();
      panel.roundRect(0, 0, REEL_WIDTH, REEL_HEIGHT, 18).fill({ color: 0x0f172a, alpha: 0.78 });
      root.addChild(panel);

      const frame = new Graphics();
      frameRef.current = frame;
      drawFrame(frame, false);
      root.addChild(frame);

      const mask = new Graphics();
      mask.roundRect(10, 10, REEL_WIDTH - 20, REEL_HEIGHT - 20, 14).fill({ color: 0xffffff });
      root.addChild(mask);

      const sprite = new Sprite();
      sprite.anchor.set(0.5);
      sprite.position.set(REEL_WIDTH / 2, REEL_HEIGHT / 2);
      sprite.mask = mask;
      spriteRef.current = sprite;
      root.addChild(sprite);

      blurRef.current = new BlurFilter({ strength: 0 });
      sprite.filters = [blurRef.current];

      const updateTicker = () => {
        const reelSprite = spriteRef.current;
        const blurFilter = blurRef.current;
        if (!reelSprite || !blurFilter) return;

        if (isSpinningRef.current) {
          spinPhaseRef.current += 0.25;
          reelSprite.y = REEL_HEIGHT / 2 + Math.sin(spinPhaseRef.current) * 8;
          blurFilter.strength = 10;
        } else {
          reelSprite.y += (REEL_HEIGHT / 2 - reelSprite.y) * 0.22;
          blurFilter.strength *= 0.75;
          if (blurFilter.strength < 0.2) blurFilter.strength = 0;
        }
      };

      app.ticker.add(updateTicker);
      app.stage.on('destroyed', () => {
        app.ticker.remove(updateTicker);
      });

      await applyTexture(symbolRef.current);
      applyWinningFilters();
    };

    setup();

    return () => {
      active = false;
      mountedRef.current = false;
      textureRequestIdRef.current += 1;
      spriteRef.current = null;
      blurRef.current = null;
      frameRef.current = null;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: false });
        appRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    symbolRef.current = symbol;
    applyTexture(symbol);
  }, [symbol]);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    isWinningRef.current = isWinning;
    highlightRef.current = highlight;
    applyWinningFilters();
  }, [isWinning, highlight]);

  return <div className="reel-pixi" ref={hostRef} aria-label={`Reel symbol: ${symbol}`} />;
}

export default PixiReel;
