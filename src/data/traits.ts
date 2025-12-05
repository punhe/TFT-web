import type { TraitDefinition } from '../types/game';

export const TRAITS: TraitDefinition[] = [
  {
    name: 'Star Guardian',
    thresholds: [3, 5, 7],
    description: 'Champions share mana with their allies whenever they cast.',
    color: '#ff9ae0'
  },
  {
    name: 'Invoker',
    thresholds: [2, 4, 6],
    description: 'Allies gain ability power and invokers cast more frequently.',
    color: '#a78bfa'
  },
  {
    name: 'Bruiser',
    thresholds: [2, 4, 6],
    description: 'Bruisers gain bonus health; your team gains health as well.',
    color: '#34d399'
  },
  {
    name: 'Warden',
    thresholds: [2, 4, 6],
    description: 'Wardens gain massive bonus armor.',
    color: '#60a5fa'
  },
  {
    name: 'Trickshot',
    thresholds: [2, 4],
    description: 'Abilities ricochet to nearby targets with reduced damage.',
    color: '#f472b6'
  },
  {
    name: 'Arcanist',
    thresholds: [2, 4, 6],
    description: 'Arcanists amplify their ability power.',
    color: '#fcd34d'
  },
  {
    name: 'Fated',
    thresholds: [3, 6],
    description: 'Pairs of Fated champions gain permanent stats after victories.',
    color: '#fb923c'
  },
  {
    name: 'Hextech',
    thresholds: [2, 4],
    description: 'Gain attack speed and on-hit magic damage.',
    color: '#4ade80'
  },
  {
    name: 'Dryad',
    thresholds: [2, 4],
    description: 'Summon saplings that heal allies at the start of combat.',
    color: '#22d3ee'
  },
  {
    name: 'Dragonlord',
    thresholds: [2, 3],
    description: 'Call down dragonfire that scorches the battlefield.',
    color: '#fbbf24'
  },
  {
    name: 'Umbral',
    thresholds: [2, 4],
    description: 'Corrupt zones empowers Umbral units and weakens enemies.',
    color: '#c084fc'
  }
];


