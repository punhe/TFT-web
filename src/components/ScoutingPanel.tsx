interface ScoutingPanelProps {
  notes: string[];
}

const ScoutingPanel = ({ notes }: ScoutingPanelProps) => (
  <section className="panel scouting-panel">
    <header>
      <h2>Scouting Notes</h2>
      <p>Keep tabs on opponents to avoid contested comps.</p>
    </header>
    <ul>
      {notes.map((note) => (
        <li key={note}>{note}</li>
      ))}
    </ul>
  </section>
);

export default ScoutingPanel;


