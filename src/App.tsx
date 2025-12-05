import { useState } from 'react';
import Board from './components/Board';
import Bench from './components/Bench';
import Shop from './components/Shop';
import PlayerPanel from './components/PlayerPanel';
import TraitPanel from './components/TraitPanel';
import RoundPlanner from './components/RoundPlanner';
import ActionLog from './components/ActionLog';
import ScoutingPanel from './components/ScoutingPanel';
import AIMatchPanel from './components/AIMatchPanel';
import { BENCH_CAPACITY, XP_TO_LEVEL } from './constants/game';
import { useGameState } from './hooks/useGameState';
import { getTraitSnapshot } from './utils/traits';
import './App.css';

type Selection =
  | {
      source: 'bench' | 'board';
      index: number;
    }
  | null;

type ActivePanel = 'shop' | 'command' | 'traits' | 'ai' | 'log' | 'scouting' | null;

const App = () => {
  const {
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
  } = useGameState();

  const [selection, setSelection] = useState<Selection>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>('shop');

  const handleBenchSelect = (index: number) => {
    if (!benchDetails[index]) return;
    setSelection({ source: 'bench', index });
  };

  const handleBoardSelect = (index: number) => {
    const unit = boardDetails[index];
    if (selection?.source === 'bench') {
      moveBenchToBoard(selection.index, index);
      setSelection(null);
      return;
    }

    if (selection?.source === 'board') {
      if (selection.index === index) {
        moveBoardToBench(index);
      } else if (boardDetails[index]) {
        swapBoardCells(selection.index, index);
      } else {
        swapBoardCells(selection.index, index);
      }
      setSelection(null);
      return;
    }

    if (unit) {
      setSelection({ source: 'board', index });
    }
  };

  const activeTraitUnits = boardDetails
    .filter((unit): unit is NonNullable<(typeof boardDetails)[number]> => Boolean(unit))
    .map((unit) => unit.data);
  const traitSnapshot = getTraitSnapshot(activeTraitUnits);

  const xpToNext = XP_TO_LEVEL[state.level] ?? null;

  return (
    <main className="layout">
      <section className="panel board-wrapper board-wrapper--full">
        <header className="board-header">
          <div>
            <h2>Battlefield</h2>
            <p>
              Select a bench unit then click a hex to deploy. Select a unit twice to recall.
            </p>
          </div>
          <div className="board-actions">
            <button type="button" onClick={() => setSelection(null)}>
              Clear selection
            </button>
          </div>
        </header>
        <Board
          units={boardDetails}
          selectedIndex={selection?.source === 'board' ? selection.index : null}
          onSelect={handleBoardSelect}
          onSell={(index) => sellBoard(index)}
        />
        <Bench
          units={benchDetails}
          capacity={BENCH_CAPACITY}
          selectedIndex={selection?.source === 'bench' ? selection.index : null}
          onSelect={handleBenchSelect}
          onSell={sellBench}
        />
      </section>

      <div className="hud-toolbar">
        <button
          type="button"
          className={activePanel === 'shop' ? 'primary' : undefined}
          onClick={() => setActivePanel('shop')}
        >
          Shop
        </button>
        <button
          type="button"
          className={activePanel === 'command' ? 'primary' : undefined}
          onClick={() => setActivePanel('command')}
        >
          Command
        </button>
        <button
          type="button"
          className={activePanel === 'traits' ? 'primary' : undefined}
          onClick={() => setActivePanel('traits')}
        >
          Traits
        </button>
        <button
          type="button"
          className={activePanel === 'ai' ? 'primary' : undefined}
          onClick={() => setActivePanel('ai')}
        >
          AI Match
        </button>
        <button
          type="button"
          className={activePanel === 'log' ? 'primary' : undefined}
          onClick={() => setActivePanel('log')}
        >
          Log
        </button>
        <button
          type="button"
          className={activePanel === 'scouting' ? 'primary' : undefined}
          onClick={() => setActivePanel('scouting')}
        >
          Scouting
        </button>
      </div>

      {activePanel && (
        <section className="panel side-panel">
          {activePanel === 'shop' && (
            <Shop
              items={state.shop}
              gold={state.gold}
              onBuy={buyUnit}
              onReroll={rerollShop}
              onFreeRefresh={refreshShop}
            />
          )}
          {activePanel === 'command' && (
            <PlayerPanel
              gold={state.gold}
              health={state.health}
              level={state.level}
              xp={state.xp}
              xpToNext={xpToNext}
              streak={state.streak}
              onBuyXp={buyXp}
            />
          )}
          {activePanel === 'traits' && <TraitPanel snapshot={traitSnapshot} />}
          {activePanel === 'ai' && (
            <>
              <AIMatchPanel
                round={state.round}
                maxRounds={state.maxRounds}
                health={state.health}
                matchFinished={state.matchFinished}
                onPlayRound={playAiRound}
              />
              <RoundPlanner
                level={state.level}
                gold={state.gold}
                health={state.health}
                traitCount={traitSnapshot.filter((trait) => trait.isActive).length}
              />
            </>
          )}
          {activePanel === 'log' && <ActionLog entries={state.log} />}
          {activePanel === 'scouting' && <ScoutingPanel notes={state.scouting} />}
        </section>
      )}
    </main>
  );
};

export default App;

