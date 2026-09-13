export default function ProgressBar({ value = 0, tone = "primary" }) {
  const pct = Math.max(0, Math.min(100, value));
  const colors = {
    primary: "bg-primary",
    warning: "bg-warning",
    danger: "bg-danger",
  };
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <div className={`h-full rounded-full ${colors[tone] || colors.primary} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}
