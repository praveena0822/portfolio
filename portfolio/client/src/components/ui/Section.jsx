export default function Section({ id, title, action, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={`${id}-title`} className="text-xl font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
