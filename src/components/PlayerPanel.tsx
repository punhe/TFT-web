interface PlayerPanelProps {
  gold: number;
  health: number;
  level: number;
  xp: number;
  xpToNext: number | null;
  streak: number;
  onBuyXp: () => void;
}

const PlayerPanel = ({
  gold,
  health,
  level,
  xp,
  xpToNext,
  streak,
  onBuyXp
}: PlayerPanelProps) => {
  const progress =
    xpToNext && xpToNext > 0 ? Math.min(100, Math.round((xp / xpToNext) * 100)) : 100;

  return (
    <section className="panel player-panel">
      <div>
        <h2>Command Center</h2>
        <p>Keep your economy and health stable.</p>
      </div>
      <div className="player-panel__stats">
        <div>
          <span>Level</span>
          <strong>{level}</strong>
        </div>
        <div>
          <span>Gold</span>
          <strong>{gold}</strong>
        </div>
        <div>
          <span>Health</span>
          <strong>{health}</strong>
        </div>
        <div>
          <span>Streak</span>
          <strong>
            {streak === 0
              ? 'Neutral'
              : streak > 0
                ? `Win ${streak}`
                : `Lose ${Math.abs(streak)}`}
          </strong>
        </div>
      </div>
      <div className="player-panel__xp">
        <div>
          <span>XP</span>
          <strong>
            {xp}/{xpToNext ?? 'MAX'}
          </strong>
        </div>
        <div className="xp-bar">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
      <button type="button" className="primary" onClick={onBuyXp}>
        Buy XP (-4g)
      </button>
    </section>
  );
};

export default PlayerPanel;

