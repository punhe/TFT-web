import type { TraitSnapshot } from '../utils/traits';

interface TraitPanelProps {
  snapshot: TraitSnapshot[];
}

const TraitPanel = ({ snapshot }: TraitPanelProps) => {
  if (!snapshot.length) {
    return (
      <section className="panel trait-panel">
        <h2>Traits</h2>
        <p>No active traits yet. Deploy units to unlock bonuses.</p>
      </section>
    );
  }

  return (
    <section className="panel trait-panel">
      <header>
        <div>
          <h2>Traits</h2>
          <p>Active bonuses from your current board.</p>
        </div>
      </header>
      <div className="trait-panel__list">
        {snapshot.map((trait) => (
          <article
            key={trait.name}
            className="trait-card"
            style={{ borderColor: trait.color }}
          >
            <div className="trait-card__head">
              <strong>{trait.name}</strong>
              <span>
                {trait.active}
                {!!trait.nextThreshold && ` / ${trait.nextThreshold}`}
              </span>
            </div>
            <p>{trait.description}</p>
            <div className="trait-card__thresholds">
              {trait.thresholds.map((value) => (
                <span
                  key={`${trait.name}-${value}`}
                  data-active={trait.active >= value}
                >
                  {value}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TraitPanel;

