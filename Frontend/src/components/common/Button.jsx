export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "btn-primary",
    secondary: "bg-surface border border-gray-200 text-text hover:bg-gray-50",
    ghost: "text-text hover:bg-gray-100",
    danger: "bg-danger text-white hover:opacity-90",
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
