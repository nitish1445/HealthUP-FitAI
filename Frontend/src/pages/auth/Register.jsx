import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheckBig,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Logomark from "../../components/common/Logomark";

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords didn't matched.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      showToast("Account created successfully");
      navigate("/onboarding");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to Create Account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Left - 60% */}
      <div className="hidden min-h-screen bg-text p-10 text-white lg:flex lg:w-[60%] lg:flex-col lg:justify-between xl:p-14">
        <Link to="/" className="flex items-center gap-3">
          <Logomark />

          <div>
            <span className="font-display text-lg font-semibold tracking-[-0.02em]">
              HealthUP
            </span>
            <p className=" text-[8px] font-semibold uppercase tracking-[0.14em] text-primary">
              Fitness Intelligence
            </p>
          </div>
        </Link>

        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            Start your journey
          </p>

          <h1 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-[1.05] tracking-[-0.045em] xl:text-6xl">
            Build a plan that{" "}
            <span className="text-primary">evolves with you.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-white/60">
            Create your HealthUP account and get personalized workouts,
            nutrition guidance, habits, recovery, and progress tracking built
            around you.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <CircleCheckBig size={18} className="text-success" />
              Personalized fitness plans
            </div>

            <div className="flex items-center gap-3 text-sm text-white/70">
              <CircleCheckBig size={18} className="text-secondary" />
              Adaptive guidance
            </div>

            <div className="flex items-center gap-3 text-sm text-white/70">
              <CircleCheckBig size={18} className="text-primary" />
              Track your progress
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-white/40">
          <span>© {new Date().getFullYear()} HealthUP</span>

          <Link
            to="/"
            className="inline-flex items-center gap-2 transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
      {/* Right - 40% */}
      <div className="flex min-h-screen w-full items-center justify-center bg-surface px-6 py-6 sm:px-10 lg:w-[40%] lg:px-10 lg:py-8 xl:px-14">
        <div className="w-full max-w-md">
          <div className="mb-5 lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary-dark"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-dark">
              Get started
            </p>

            <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.035em] text-text sm:text-3xl">
              Create your account
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-muted">
              Start your personalized fitness journey with HealthUP.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-danger">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="At least 8 characters"
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 pr-11 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-text cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="Re-enter your password"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer group mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark hover:shadow-[0_6px_18px_rgba(255,157,80,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && (
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              )}
            </button>

            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary-dark transition-colors hover:text-primary"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
