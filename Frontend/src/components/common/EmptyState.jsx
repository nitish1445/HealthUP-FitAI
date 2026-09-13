export default function EmptyState({ title, description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center">
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}
