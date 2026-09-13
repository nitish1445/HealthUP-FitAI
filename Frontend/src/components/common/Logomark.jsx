export default function Logomark({ size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="healthup-logo-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>

      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke="var(--border)"
        strokeWidth="4"
      />

      <path
        d="M16 3 A13 13 0 0 1 27.3 21.5"
        fill="none"
        stroke="url(#healthup-logo-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle cx="16" cy="16" r="4" fill="var(--green)" />
    </svg>
  );
}
