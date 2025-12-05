# TFT Tactics Lab

Lightweight browser sandbox inspired by Riot's Teamfight Tactics. Draft units, track trait breakpoints, and plan your next level-up timing directly in the browser.

## Tech stack

- Vite + React + TypeScript
- Flat ESLint config with TypeScript + React rules
- Vanilla CSS for a game-inspired UI

## Available scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Gameplay loop

1. **Shop:** Reroll and purchase champions with TFT-inspired cost odds.
2. **Bench & Board:** Select bench units and click any hex to deploy. Select a fielded unit twice to recall it.
3. **Traits:** Trait panel updates live as you field units.
4. **Round planner:** Simple guidance text reacts to your economy, level, and trait progress.
5. **Scouting:** Default scouting notes emulate lobby intel; refresh the shop to generate new ideas.

All UI text remains in English per the requirement, while this documentation explains the overall project setup.


