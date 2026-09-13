const COLORS = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  neutral: "bg-gray-100 text-gray-700",
};

export default function Badge({ children, tone = "neutral" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${COLORS[tone] || COLORS.neutral}`}>
      {children}
    </span>
  );
}
