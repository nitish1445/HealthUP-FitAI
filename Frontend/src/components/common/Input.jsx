export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="font-medium text-text">{label}</span>}
      <input
        className={`rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 focus:border-primary ${
          error ? "border-danger" : "border-gray-200"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
