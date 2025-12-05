import clsx from 'clsx';
import type { OwnedUnit, UnitDefinition } from '../types/game';

export interface BenchUnit extends OwnedUnit {
  data: UnitDefinition;
}

interface BenchProps {
  units: BenchUnit[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onSell: (index: number) => void;
  capacity: number;
}

const Bench = ({
  units,
  selectedIndex,
  onSelect,
  onSell,
  capacity
}: BenchProps) => {
  const slots = Array.from({ length: capacity }).map((_, index) => units[index] ?? null);

  return (
    <div className="bench">
      {slots.map((unit, index) =>
        unit ? (
          <button
            key={`bench-${unit.instanceId}`}
            type="button"
            className={clsx('bench-card', selectedIndex === index && 'bench-card--selected')}
            onClick={() => onSelect(index)}
          >
            <img src={unit.data.icon} alt={unit.data.name} loading="lazy" />
            <div>
              <p>{unit.data.name}</p>
              <small>{unit.data.traits.join(' · ')}</small>
            </div>
            <span>{'★'.repeat(unit.stars)}</span>
            <span
              className="bench-card__sell"
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onSell(index);
              }}
            >
              Sell
            </span>
          </button>
        ) : (
          <div key={`bench-empty-${index}`} className="bench-card bench-card--empty">
            Empty
          </div>
        )
      )}
    </div>
  );
};

export default Bench;


