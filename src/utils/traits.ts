import { TRAITS } from '../data/traits';
import type { TraitDefinition } from '../types/game';

export interface TraitSnapshot extends TraitDefinition {
  active: number;
  nextThreshold: number | null;
  isActive: boolean;
}

export const getTraitSnapshot = (
  boardUnits: { traits: string[] }[]
): TraitSnapshot[] => {
  const tally = boardUnits.reduce<Record<string, number>>((acc, unit) => {
    unit.traits.forEach((trait) => {
      acc[trait] = (acc[trait] ?? 0) + 1;
    });
    return acc;
  }, {});

  return TRAITS.map((trait) => {
    const amount = tally[trait.name] ?? 0;
    const nextThreshold =
      trait.thresholds.find((value) => value > amount) ?? null;
    return {
      ...trait,
      active: amount,
      nextThreshold,
      isActive: amount >= (trait.thresholds[0] ?? Infinity)
    };
  }).filter((trait) => trait.active > 0);
};

