import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthRequired() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-center text-text">
      <div className="relative w-full max-w-lg">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-light">
            <LockKeyhole size={28} className="text-secondary-dark" />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-dark">
            Authentication required
          </p>

          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-text sm:text-4xl">
            Please log in to continue.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base">
            You need an account to access this page and your personalized
            HealthUP experience.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/login"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark hover:shadow-[0_8px_20px_rgba(255,157,80,0.25)]"
            >
              Log in
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-surface px-6 text-sm font-semibold text-text transition-colors duration-200 hover:bg-surface-soft"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
