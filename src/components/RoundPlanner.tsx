interface RoundPlannerProps {
  level: number;
  gold: number;
  health: number;
  traitCount: number;
}

const RoundPlanner = ({
  level,
  gold,
  health,
  traitCount
}: RoundPlannerProps) => {
  const priorities = [
    gold < 30 ? 'Stabilize economy to hit 30 gold interest.' : 'Maintain 50 gold for maximum interest.',
    traitCount >= 3 ? 'Look for upgrades to solidify current synergy.' : 'Add more traits to unlock bonuses.',
    level < 7 ? 'Plan a level up on Stage 3-2 for stronger shop odds.' : 'Scout for legendary win-conditions.',
    health < 40 ? 'Play for board strength to avoid elimination.' : 'You can greed econ thanks to healthy HP.'
  ];

  return (
    <section className="panel round-planner">
      <header>
        <div>
          <h2>Round Planner</h2>
          <p>What to do before the next combat.</p>
        </div>
      </header>
      <ul>
        {priorities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

export default RoundPlanner;


