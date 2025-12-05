import { UNIT_POOL } from '../data/units';
import type { UnitDefinition } from '../types/game';

const COST_BUCKETS: Record<number, UnitDefinition[]> = UNIT_POOL.reduce(
  (acc, unit) => {
    if (!acc[unit.cost]) {
      acc[unit.cost] = [];
    }
    acc[unit.cost].push(unit);
    return acc;
  },
  {} as Record<number, UnitDefinition[]>
);

const LEVEL_ROLL_TABLE: Record<
  number,
  Array<{ cost: number; weight: number }>
> = {
  1: [
    { cost: 1, weight: 100 }
  ],
  2: [
    { cost: 1, weight: 75 },
    { cost: 2, weight: 25 }
  ],
  3: [
    { cost: 1, weight: 55 },
    { cost: 2, weight: 30 },
    { cost: 3, weight: 15 }
  ],
  4: [
    { cost: 1, weight: 40 },
    { cost: 2, weight: 33 },
    { cost: 3, weight: 20 },
    { cost: 4, weight: 7 }
  ],
  5: [
    { cost: 1, weight: 30 },
    { cost: 2, weight: 35 },
    { cost: 3, weight: 25 },
    { cost: 4, weight: 10 }
  ],
  6: [
    { cost: 1, weight: 19 },
    { cost: 2, weight: 30 },
    { cost: 3, weight: 35 },
    { cost: 4, weight: 15 },
    { cost: 5, weight: 1 }
  ],
  7: [
    { cost: 1, weight: 14 },
    { cost: 2, weight: 20 },
    { cost: 3, weight: 40 },
    { cost: 4, weight: 20 },
    { cost: 5, weight: 6 }
  ],
  8: [
    { cost: 1, weight: 10 },
    { cost: 2, weight: 15 },
    { cost: 3, weight: 30 },
    { cost: 4, weight: 30 },
    { cost: 5, weight: 15 }
  ],
  9: [
    { cost: 1, weight: 5 },
    { cost: 2, weight: 10 },
    { cost: 3, weight: 20 },
    { cost: 4, weight: 40 },
    { cost: 5, weight: 25 }
  ]
};

const DEFAULT_ROLL_TABLE = LEVEL_ROLL_TABLE[3];

const pickRandom = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export const rollShopUnit = (level: number): UnitDefinition => {
  const table = LEVEL_ROLL_TABLE[level] ?? DEFAULT_ROLL_TABLE;
  const totalWeight = table.reduce((sum, row) => sum + row.weight, 0);
  let ticket = Math.random() * totalWeight;

  for (const entry of table) {
    if (ticket < entry.weight) {
      const pool = COST_BUCKETS[entry.cost] ?? UNIT_POOL;
      return pickRandom(pool);
    }
    ticket -= entry.weight;
  }

  return pickRandom(UNIT_POOL);
};

export const getShop = (level: number, slots = 5): UnitDefinition[] =>
  Array.from({ length: slots }, () => rollShopUnit(level));


