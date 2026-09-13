import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Scale,
  Flame,
  Activity,
  Zap,
  CheckCircle2,
  RefreshCw,
  Dumbbell,
  Utensils,
  ArrowRight,
} from "lucide-react";
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";

export default function Dashboard() {
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logging, setLogging] = useState(false);

  const load = useCallback(
    async (showSuccessToast = false) => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/dashboard");
        setData(res.data.data);

        if (showSuccessToast) {
          showToast("Dashboard refreshed successfully.");
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || "Unable to load your dashboard.";

        setError(message);
        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleQuickComplete = async () => {
    if (!data?.todayWorkout) return;

    setLogging(true);

    try {
      showToast("Workout logging route is not connected yet.", "error");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Unable to save your workout.",
        "error",
      );
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className="h-8 w-64 animate-pulse rounded-lg bg-surface-soft" />
          <div className="mt-2 h-4 w-52 animate-pulse rounded bg-surface-soft" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
          <Activity size={21} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-text">
          Unable to load dashboard
        </h2>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted">{error}</p>

        <button
          type="button"
          onClick={() => load()}
          className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-text px-4 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:opacity-90 active:scale-95"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary-dark">
          <Target size={21} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-text">
          Let's set up your profile
        </h2>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Complete your fitness profile to get a personalized workout and diet
          plan.
        </p>

        <Link
          to="/onboarding"
          className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark hover:shadow-[0_5px_14px_rgba(255,157,80,0.25)] active:scale-95"
        >
          Start Onboarding
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const {
    profile,
    currentWeightKg,
    todayWorkout,
    dietPlan,
    habit,
    recovery,
    forecast,
    recentAdjustments,
  } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-text">
            Welcome back,
          </h1>

          <p className="mt-1 text-sm text-muted">
            Here's where things stand today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading}
          className="group inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-surface px-3 text-xs font-medium text-muted transition-all duration-200 hover:bg-surface-soft hover:text-text active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Refresh dashboard"
          title="Refresh dashboard"
        >
          <RefreshCw
            size={15}
            className={`transition-transform duration-500 ${
              loading ? "animate-spin" : "group-hover:rotate-180"
            }`}
          />

          <span className="hidden sm:inline">
            {loading ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <Target size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Goal
            </span>
          </div>

          <p className="mt-5 truncate text-xl font-semibold text-text">
            {profile?.primaryGoal || "—"}
          </p>

          <p className="mt-1 text-xs text-muted">Active fitness goal</p>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
              <Scale size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Weight
            </span>
          </div>

          <p className="mt-5 text-xl font-semibold text-text">
            {currentWeightKg ?? "—"} kg
          </p>

          <p className="mt-1 text-xs text-muted">
            Target: {profile?.targetWeightKg ?? "—"} kg
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-light text-success-dark">
              <Flame size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Habits
            </span>
          </div>

          <p className="mt-5 text-xl font-semibold text-text">
            {habit?.habitScore ?? 0}/100
          </p>

          <p className="mt-1 text-xs text-muted">
            Streak: {habit?.streak ?? 0} day(s)
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <Zap size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Energy
            </span>
          </div>

          <p className="mt-5 truncate text-xl font-semibold text-text">
            {recovery?.hasData
              ? recovery?.todayEnergyLevel || "Not logged today"
              : "No data"}
          </p>

          <p className="mt-1 text-xs text-muted">Today's recovery status</p>
        </div>
      </div>

      {/* Workout + Diet */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                <Dumbbell size={18} />
              </div>

              <div>
                <h2 className="font-display text-base font-semibold text-text">
                  Today's Workout
                </h2>

                <p className="mt-0.5 text-xs text-muted">
                  Your scheduled training
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/workout"
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary-dark transition-colors hover:text-text"
            >
              View plan
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-5">
            {!todayWorkout ? (
              <div className="rounded-xl bg-background p-4">
                <p className="text-sm leading-6 text-muted">
                  No active plan yet. Visit the Workout page to generate one.
                </p>

                <Link
                  to="/dashboard/workout"
                  className="mt-3 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary-dark"
                >
                  Open Workout
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : todayWorkout.isRestDay ? (
              <div className="rounded-xl bg-success-light p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-semibold text-success-dark">
                    Rest Day
                  </span>

                  <span className="text-sm text-text">
                    Recovery is part of the plan.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-success-light px-2.5 py-1 text-[10px] font-semibold text-success-dark">
                    {todayWorkout.focus}
                  </span>

                  <span className="text-xs text-muted">
                    {todayWorkout.exercises?.length || 0} exercises
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {todayWorkout.exercises?.slice(0, 3).map((ex) => (
                    <div
                      key={ex.name}
                      className="flex items-center justify-between gap-4 rounded-xl bg-background px-3.5 py-3"
                    >
                      <span className="truncate text-sm font-medium text-text">
                        {ex.name}
                      </span>

                      <span className="shrink-0 text-xs text-muted">
                        {ex.sets} × {ex.repsRange}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleQuickComplete}
                  disabled={logging}
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 size={16} />
                  {logging ? "Saving..." : "Mark Completed"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
                <Utensils size={18} />
              </div>

              <div>
                <h2 className="font-display text-base font-semibold text-text">
                  Today's Diet
                </h2>

                <p className="mt-0.5 text-xs text-muted">
                  Your nutrition targets
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/diet"
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary-dark transition-colors hover:text-text"
            >
              View plan
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-5">
            {!dietPlan ? (
              <div className="rounded-xl bg-background p-4">
                <p className="text-sm leading-6 text-muted">
                  No active diet plan yet. Visit the Diet page to generate one.
                </p>

                <Link
                  to="/dashboard/diet"
                  className="mt-3 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary-dark"
                >
                  Open Diet
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-background p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                    Calories
                  </p>
                  <p className="mt-2 text-lg font-semibold text-text">
                    {dietPlan.calorieTarget ?? "—"}
                  </p>
                  <p className="text-[11px] text-muted">kcal</p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                    Protein
                  </p>
                  <p className="mt-2 text-lg font-semibold text-text">
                    {dietPlan.macroTarget?.protein ?? "—"}
                  </p>
                  <p className="text-[11px] text-muted">grams</p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                    Carbs
                  </p>
                  <p className="mt-2 text-lg font-semibold text-text">
                    {dietPlan.macroTarget?.carbs ?? "—"}
                  </p>
                  <p className="text-[11px] text-muted">grams</p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                    Fat
                  </p>
                  <p className="mt-2 text-lg font-semibold text-text">
                    {dietPlan.macroTarget?.fat ?? "—"}
                  </p>
                  <p className="text-[11px] text-muted">grams</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forecast + Coach */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
              <TrendingIcon />
            </div>

            <div>
              <h2 className="font-display text-base font-semibold text-text">
                Goal Forecast
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                Based on your current trajectory
              </p>
            </div>
          </div>

          <div className="mt-5">
            {!forecast?.hasEnoughData ? (
              <p className="text-sm leading-6 text-muted">
                {forecast?.message ||
                  "Keep logging your progress to unlock your forecast."}
              </p>
            ) : forecast?.estimatedWeeksRange ? (
              <p className="text-sm leading-7 text-text">
                At your current trajectory (
                {forecast.currentTrajectoryKgPerWeek} kg/week), you're projected
                to reach your goal in{" "}
                <strong>
                  {forecast.estimatedWeeksRange[0]}–
                  {forecast.estimatedWeeksRange[1]} weeks
                </strong>
                .
              </p>
            ) : (
              <p className="text-sm leading-6 text-muted">
                {forecast?.message}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-text p-5 shadow-[0_4px_24px_rgba(23,32,27,0.08)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary">
              <Zap size={18} />
            </div>

            <div>
              <h2 className="font-display text-base font-semibold text-white">
                AI Coach
              </h2>

              <p className="mt-0.5 text-xs text-white/50">
                Your next best step
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-white/70">
            {recovery?.hasData
              ? recovery?.recommendation
              : "Log an energy check-in to get a personalized recommendation."}
          </p>

          <Link
            to="/dashboard/coach"
            className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-text transition-all duration-200 hover:-translate-y-px hover:bg-primary-dark active:scale-[0.98]"
          >
            Ask HealthUP Coach
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Recent adjustments */}
      {recentAdjustments?.length > 0 && (
        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <Activity size={17} />
            </div>

            <div>
              <h2 className="font-display text-base font-semibold text-text">
                Your plan was adjusted
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                Recent changes based on your progress
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {recentAdjustments.map((adj) => (
              <div key={adj._id} className="rounded-xl bg-background p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-primary-dark">
                  Reason
                </p>

                <p className="mt-1 text-sm leading-6 text-text">{adj.reason}</p>

                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary-dark">
                  Change
                </p>

                <p className="mt-1 text-sm leading-6 text-text">{adj.change}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TrendingIcon() {
  return <Activity size={18} />;
}
