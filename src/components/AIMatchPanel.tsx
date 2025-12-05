interface AIMatchPanelProps {
  round: number;
  maxRounds: number;
  health: number;
  matchFinished: boolean;
  onPlayRound: () => void;
}

const AIMatchPanel = ({
  round,
  maxRounds,
  health,
  matchFinished,
  onPlayRound
}: AIMatchPanelProps) => {
  const clampedRound = Math.min(round, maxRounds);
  const progress = Math.round((clampedRound / maxRounds) * 100);

  return (
    <section className="panel ai-panel">
      <header>
        <div>
          <h2>AI Match (3 rounds)</h2>
          <p>Play quick simulated fights against an AI board.</p>
        </div>
      </header>

      <div className="ai-panel__status">
        <div>
          <span>Round</span>
          <strong>
            {clampedRound} / {maxRounds}
          </strong>
        </div>
        <div>
          <span>Health</span>
          <strong>{health}</strong>
        </div>
      </div>

      <div className="xp-bar">
        <div style={{ width: `${progress}%` }} />
      </div>

      <button
        type="button"
        className="primary"
        disabled={matchFinished}
        onClick={onPlayRound}
      >
        {matchFinished ? 'Match finished' : 'Play next round vs AI'}
      </button>

      {matchFinished && (
        <p className="ai-panel__hint">
          This 3-round AI match is complete. Adjust your board and economy, then try
          another run.
        </p>
      )}
    </section>
  );
};

export default AIMatchPanel;


