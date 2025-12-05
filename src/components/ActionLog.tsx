interface ActionLogProps {
  entries: string[];
}

const ActionLog = ({ entries }: ActionLogProps) => (
  <section className="panel action-log">
    <header>
      <h2>Action Log</h2>
      <p>Your latest strategic moves.</p>
    </header>
    <ul>
      {entries.map((entry, index) => (
        <li key={`${entry}-${index}`}>{entry}</li>
      ))}
    </ul>
  </section>
);

export default ActionLog;


