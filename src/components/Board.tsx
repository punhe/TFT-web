import clsx from 'clsx';
import type { OwnedUnit, UnitDefinition } from '../types/game';

export interface BoardUnit extends OwnedUnit {
  data: UnitDefinition;
}

interface BoardProps {
  units: Array<BoardUnit | null>;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onSell: (index: number) => void;
  rows?: number;
  cols?: number;
}

const DEFAULT_COLS = 7;

const Board = ({
  units,
  selectedIndex,
  onSelect,
  onSell,
  cols = DEFAULT_COLS
}: BoardProps) => {
  const rows = Math.ceil(units.length / cols);

  return (
    <div className="board">
      <div
        className="board-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const unit = units[index] ?? null;
          const isSelected = selectedIndex === index;
          return (
            <button
              key={`hex-${index}`}
              type="button"
              className={clsx('hex', isSelected && 'hex--selected', unit && 'hex--occupied')}
              onClick={() => onSelect(index)}
            >
              {unit ? (
                <>
                  <img
                    src={unit.data.icon}
                    alt={unit.data.name}
                    className="hex__portrait"
                    loading="lazy"
                  />
                  <div className="hex__info">
                    <span className="hex__name">{unit.data.name}</span>
                    <span className="hex__traits">{unit.data.traits.join(' · ')}</span>
                  </div>
                  <span className={`hex__cost cost-${unit.data.cost}`}>{unit.data.cost}</span>
                  <span className="hex__stars">{'★'.repeat(unit.stars)}</span>
                  <span
                    className="hex__sell"
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSell(index);
                    }}
                  >
                    Sell
                  </span>
                </>
              ) : (
                <span className="hex__placeholder">Empty</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Board;


