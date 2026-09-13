export default function StatCard({ label, value, sub, icon: Icon, tone = "default" }) {
  return (
    <div className="card p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
        {Icon && <Icon size={18} className="text-primary" />}
      </div>
      <span className="text-2xl font-semibold text-text">{value}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </div>
  );
}
