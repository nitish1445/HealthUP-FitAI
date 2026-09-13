import { ArrowLeft, CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12 text-center text-text">
      <div className="relative w-full max-w-xl">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light">
            <CircleAlert size={30} className="text-primary-dark" />
          </div>

          <p className="mt-7 font-display text-sm font-semibold uppercase tracking-[0.18em] text-secondary-dark">
            Page not found
          </p>

          <h1 className="mt-3 font-display text-7xl font-bold leading-none tracking-[-0.06em] text-text sm:text-8xl">
            404
          </h1>

          <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Looks like you took a wrong turn.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted sm:text-base">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on track.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark hover:shadow-[0_8px_20px_rgba(255,157,80,0.25)]"
            >
              Back to Home
              <ArrowLeft
                size={16}
                className="order-first transition-transform duration-200 group-hover:-translate-x-0.5"
              />
            </Link>

            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-surface px-6 text-sm font-semibold text-text transition-colors duration-200 hover:bg-surface-soft"
            >
              Contact us
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="ml-1 text-xs font-medium text-muted">
              HealthUP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
