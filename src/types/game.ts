export type TraitKey =
  | 'Star Guardian'
  | 'Invoker'
  | 'Bruiser'
  | 'Trickshot'
  | 'Warden'
  | 'Arcanist'
  | 'Fated'
  | 'Hextech'
  | 'Dryad'
  | 'Dragonlord'
  | 'Umbral';

export type UnitTier = 1 | 2 | 3 | 4 | 5;

export interface UnitDefinition {
  id: string;
  name: string;
  cost: UnitTier;
  traits: TraitKey[];
  icon: string;
  ability: string;
  role: 'Carry' | 'Frontline' | 'Support';
  description: string;
}

export interface OwnedUnit {
  instanceId: string;
  baseId: string;
  stars: 1 | 2 | 3;
}

export type BoardCell = OwnedUnit | null;

export interface TraitDefinition {
  name: TraitKey;
  thresholds: number[];
  description: string;
  color: string;
}

export interface GameState {
  gold: number;
  health: number;
  level: number;
  xp: number;
  round: number;
  maxRounds: number;
  matchFinished: boolean;
  bench: OwnedUnit[];
  board: BoardCell[];
  shop: Array<UnitDefinition | null>;
  streak: number;
  scouting: string[];
  log: string[];
}

