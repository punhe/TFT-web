import { useCallback, useMemo, useState } from 'react';
import { UNIT_POOL } from '../data/units';
import {
  BENCH_CAPACITY,
  BOARD_SIZE,
  MAX_LEVEL,
  REROLL_COST,
  XP_COST,
  XP_PER_PURCHASE,
  XP_TO_LEVEL,
  AI_MATCH_ROUNDS
} from '../constants/game';
import { getShop } from '../utils/shop';
import type { BoardCell, GameState, OwnedUnit, UnitDefinition } from '../types/game';
import { getTraitSnapshot } from '../utils/traits';

const findUnit = (id: string): UnitDefinition =>
  UNIT_POOL.find((unit) => unit.id === id) ?? UNIT_POOL[0];

const createOwnedUnit = (baseId: string): OwnedUnit => ({
  baseId,
  instanceId: `${baseId}-${Math.random().toString(36).slice(2, 7)}-${Date.now()
    .toString(36)
    .slice(-4)}`,
  stars: 1
});

const emptyBoard = (): BoardCell[] => Array.from({ length: BOARD_SIZE }, () => null);

const withLog = (previous: GameState, message: string): string[] => {
  const log = [message, ...previous.log];
  return log.slice(0, 10);
};

const applyLevelUps = (level: number, xp: number) => {
  let nextLevel = level;
  let nextXp = xp;
  while (nextLevel < MAX_LEVEL) {
    const required = XP_TO_LEVEL[nextLevel];
    if (!required || nextXp < required) {
      break;
    }
    nextXp -= required;
    nextLevel += 1;
  }
  return { nextLevel, nextXp };
};

interface UseGameStateResult {
  state: GameState;
  boardDetails: Array<BoardCell & { data: UnitDefinition } | null>;
  benchDetails: Array<OwnedUnit & { data: UnitDefinition }>;
  buyUnit: (slotIndex: number) => void;
  sellBench: (benchIndex: number) => void;
  sellBoard: (cellIndex: number) => void;
  moveBenchToBoard: (benchIndex: number, cellIndex: number) => void;
  moveBoardToBench: (cellIndex: number) => void;
  swapBoardCells: (source: number, target: number) => void;
  rerollShop: () => void;
  buyXp: () => void;
  refreshShop: () => void;
  playAiRound: () => void;
}

const scoutingPresets = [
  'Bounty reroll lobby with triple Trickshot players.',
  'Fast 9 players open-fort for Star Guardian legendary board.',
  'Bruiser reroll spike incoming on Stage 3-2.',
  'Aphelios contested by two other players.'
];

const createInitialState = (): GameState => ({
  gold: 20,
  health: 100,
  level: 3,
  xp: 0,
  round: 1,
  maxRounds: AI_MATCH_ROUNDS,
  matchFinished: false,
  bench: [],
  board: emptyBoard(),
  shop: getShop(3),
  streak: 0,
  scouting: scoutingPresets,
  log: ['Welcome to TFT Tactics Lab. Start planning your comp!']
});

export const useGameState = (): UseGameStateResult => {
  const [state, setState] = useState<GameState>(() => createInitialState());

  const boardDetails = useMemo(
    () =>
      state.board.map((cell) =>
        cell ? { ...cell, data: findUnit(cell.baseId) } : null
      ),
    [state.board]
  );

  const benchDetails = useMemo(
    () => state.bench.map((unit) => ({ ...unit, data: findUnit(unit.baseId) })),
    [state.bench]
  );

  const updateState = useCallback(
    (
      mutator: (previous: GameState) => GameState,
      onChange?: (next: GameState) => void
    ) => {
      setState((previous) => {
        const next = mutator(previous);
        onChange?.(next);
        return next;
      });
    },
    []
  );

  const buyUnit = useCallback(
    (slotIndex: number) => {
      updateState((previous) => {
        const offer = previous.shop[slotIndex];
        if (!offer) {
          return previous;
        }
        if (previous.gold < offer.cost) {
          return {
            ...previous,
            log: withLog(previous, `Not enough gold to buy ${offer.name}.`)
          };
        }
        if (previous.bench.length >= BENCH_CAPACITY) {
          return {
            ...previous,
            log: withLog(previous, 'Bench is full. Free up space first.')
          };
        }
        const bench = [...previous.bench, createOwnedUnit(offer.id)];
        const shop = [...previous.shop];
        shop[slotIndex] = null;
        return {
          ...previous,
          gold: previous.gold - offer.cost,
          bench,
          shop,
          log: withLog(previous, `Bought ${offer.name} for ${offer.cost} gold.`)
        };
      });
    },
    [updateState]
  );

  const sellBench = useCallback(
    (benchIndex: number) => {
      updateState((previous) => {
        const unit = previous.bench[benchIndex];
        if (!unit) return previous;
        const hero = findUnit(unit.baseId);
        return {
          ...previous,
          bench: previous.bench.filter((_, idx) => idx !== benchIndex),
          gold: previous.gold + hero.cost,
          log: withLog(previous, `Sold ${hero.name} for ${hero.cost} gold.`)
        };
      });
    },
    [updateState]
  );

  const sellBoard = useCallback(
    (cellIndex: number) => {
      updateState((previous) => {
        const unit = previous.board[cellIndex];
        if (!unit) return previous;
        const hero = findUnit(unit.baseId);
        const board = [...previous.board];
        board[cellIndex] = null;
        return {
          ...previous,
          board,
          gold: previous.gold + hero.cost,
          log: withLog(previous, `Sold ${hero.name} from the board.`)
        };
      });
    },
    [updateState]
  );

  const moveBenchToBoard = useCallback(
    (benchIndex: number, cellIndex: number) => {
      updateState((previous) => {
        const unit = previous.bench[benchIndex];
        if (!unit) return previous;
        if (previous.board[cellIndex]) {
          return {
            ...previous,
            log: withLog(previous, 'Cell occupied. Pick another hex.')
          };
        }
        const deployed = previous.board.filter(Boolean).length;
        if (deployed >= previous.level) {
          return {
            ...previous,
            log: withLog(previous, 'You reached your unit cap. Level up for more slots.')
          };
        }

        const board = [...previous.board];
        board[cellIndex] = unit;
        const bench = previous.bench.filter((_, idx) => idx !== benchIndex);
        const hero = findUnit(unit.baseId);
        return {
          ...previous,
          board,
          bench,
          log: withLog(previous, `Deployed ${hero.name} onto the board.`)
        };
      });
    },
    [updateState]
  );

  const moveBoardToBench = useCallback(
    (cellIndex: number) => {
      updateState((previous) => {
        const unit = previous.board[cellIndex];
        if (!unit) return previous;
        if (previous.bench.length >= BENCH_CAPACITY) {
          return {
            ...previous,
            log: withLog(previous, 'Bench is full. Sell or deploy units.')
          };
        }

        const bench = [...previous.bench, unit];
        const board = [...previous.board];
        board[cellIndex] = null;
        const hero = findUnit(unit.baseId);
        return {
          ...previous,
          bench,
          board,
          log: withLog(previous, `Recalled ${hero.name} back to the bench.`)
        };
      });
    },
    [updateState]
  );

  const swapBoardCells = useCallback(
    (source: number, target: number) => {
      updateState((previous) => {
        const sourceUnit = previous.board[source];
        if (!sourceUnit || source === target) return previous;
        const board = [...previous.board];
        [board[source], board[target]] = [board[target], board[source]];
        const hero = findUnit(sourceUnit.baseId);
        return {
          ...previous,
          board,
          log: withLog(previous, `Moved ${hero.name} to a new hex.`)
        };
      });
    },
    [updateState]
  );

  const rerollShop = useCallback(() => {
    updateState((previous) => {
      if (previous.gold < REROLL_COST) {
        return {
          ...previous,
          log: withLog(previous, 'Not enough gold to reroll.')
        };
      }
      return {
        ...previous,
        gold: previous.gold - REROLL_COST,
        shop: getShop(previous.level),
        log: withLog(previous, 'Shop refreshed.')
      };
    });
  }, [updateState]);

  const refreshShop = useCallback(() => {
    updateState((previous) => ({
      ...previous,
      shop: getShop(previous.level),
      log: withLog(previous, 'Free scouting refresh applied.')
    }));
  }, [updateState]);

  const buyXp = useCallback(() => {
    updateState((previous) => {
      if (previous.gold < XP_COST) {
        return {
          ...previous,
          log: withLog(previous, 'Not enough gold to buy XP.')
        };
      }
      if (previous.level >= MAX_LEVEL) {
        return {
          ...previous,
          log: withLog(previous, 'Already at max level.')
        };
      }

      const gainedXp = previous.xp + XP_PER_PURCHASE;
      const { nextLevel, nextXp } = applyLevelUps(previous.level, gainedXp);

      return {
        ...previous,
        gold: previous.gold - XP_COST,
        level: nextLevel,
        xp: nextXp,
        log: withLog(previous, 'Purchased XP.')
      };
    });
  }, [updateState]);

  const playAiRound = useCallback(() => {
    updateState((previous) => {
      if (previous.matchFinished) {
        return {
          ...previous,
          log: withLog(previous, 'AI match already finished. Reset the board to play again.')
        };
      }

      if (previous.round > previous.maxRounds) {
        return {
          ...previous,
          matchFinished: true,
          log: withLog(previous, 'AI match already finished.'),
        };
      }

      const deployedUnits = previous.board.filter((cell): cell is NonNullable<typeof cell> =>
        Boolean(cell)
      );

      if (!deployedUnits.length) {
        const damage = 10;
        const nextHealth = Math.max(0, previous.health - damage);
        const finished = nextHealth <= 0 || previous.round >= previous.maxRounds;
        return {
          ...previous,
          health: nextHealth,
          round: finished ? previous.round : previous.round + 1,
          matchFinished: finished,
          streak: previous.streak <= 0 ? previous.streak - 1 : -1,
          log: withLog(previous, 'No units on board. You were stomped by the AI for 10 damage.')
        };
      }

      const boardUnits = deployedUnits.map((unit) => findUnit(unit.baseId));
      const traitSnapshot = getTraitSnapshot(boardUnits);
      const activeTraits = traitSnapshot.filter((trait) => trait.isActive).length;

      const unitPower = deployedUnits.reduce((sum, unit) => {
        const base = findUnit(unit.baseId);
        return sum + base.cost * 8 * unit.stars;
      }, 0);

      const traitPower = activeTraits * 20 + traitSnapshot.length * 10;
      const levelBonus = previous.level * 10;

      const ourPower = unitPower + traitPower + levelBonus;

      const roundScale = 20 * previous.round;
      const enemyBase = ourPower * 0.9 + roundScale;
      const variance = enemyBase * 0.25;
      const enemyPower = enemyBase + (Math.random() - 0.5) * 2 * variance;

      const win = ourPower >= enemyPower;
      const damage = Math.max(3, 7 - previous.round);

      let nextHealth = previous.health;
      let nextGold = previous.gold;
      let nextStreak = previous.streak;

      if (win) {
        nextGold += 4;
        nextStreak = nextStreak >= 0 ? nextStreak + 1 : 1;
      } else {
        nextHealth = Math.max(0, previous.health - damage);
        nextStreak = nextStreak <= 0 ? nextStreak - 1 : -1;
      }

      const finished = nextHealth <= 0 || previous.round >= previous.maxRounds;
      const nextRound = finished ? previous.round : previous.round + 1;

      const label = win ? 'WIN' : 'LOSS';
      const summary = `${label} vs AI on round ${previous.round} — your power ${Math.round(
        ourPower
      )} vs enemy ${Math.round(enemyPower)}.`;

      return {
        ...previous,
        health: nextHealth,
        gold: nextGold,
        round: nextRound,
        matchFinished: finished,
        streak: nextStreak,
        log: withLog(previous, summary)
      };
    });
  }, [updateState]);

  return {
    state,
    boardDetails,
    benchDetails,
    buyUnit,
    sellBench,
    sellBoard,
    moveBenchToBoard,
    moveBoardToBench,
    swapBoardCells,
    rerollShop,
    buyXp,
    refreshShop,
    playAiRound
  };
};

