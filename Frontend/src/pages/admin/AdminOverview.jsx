import { useEffect, useState, useCallback } from "react";
import api from "../../config/Api";
import {
  Users,
  Activity,
  Dumbbell,
  Utensils,
  Target,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function AdminOverview() {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    async (showSuccessToast = false) => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/admin/overview");
        setData(res.data.data);

        if (showSuccessToast) {
          showToast("Overview data refreshed successfully.");
        }
      } catch (err) {
        const message = err?.response?.data?.message || "Unable to load users.";

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

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-16 animate-pulse rounded-2xl bg-surface-soft" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger-light text-danger">
          <Activity size={20} />
        </div>

        <h2 className="mt-4 text-sm font-semibold text-text">
          Unable to load overview
        </h2>

        <p className="mt-1 max-w-sm text-sm text-muted">{error}</p>

        <button
          type="button"
          onClick={load}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-text px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    );
  }

  const workoutAdherence = data?.platformWorkoutAdherencePct;
  const dietAdherence = data?.platformDietAdherencePct;

  const totalProfiles =
    data?.goalDistribution?.reduce((total, item) => total + item.count, 0) || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <TrendingUp size={18} />
            </div>

            <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-text">
              Admin Overview
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted">
            Platform-wide analytics and activity overview.
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading}
          className="group inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-surface px-3 text-xs font-medium text-muted transition-all duration-200 hover:bg-surface-soft hover:text-text active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Refresh users"
          title="Refresh users"
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
        <div className="rounded-2xl bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <Users size={19} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Users
            </span>
          </div>

          <p className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em] text-text">
            {data?.totalUsers ?? 0}
          </p>

          <p className="mt-1 text-xs text-muted">Total registered users</p>
        </div>

        <div className="rounded-2xl bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
              <Activity size={19} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Activity
            </span>
          </div>

          <p className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em] text-text">
            {data?.activeUsers ?? 0}
          </p>

          <p className="mt-1 text-xs text-muted">Active users in 30 days</p>
        </div>

        <div className="rounded-2xl bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-light text-success-dark">
              <Dumbbell size={19} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Workout
            </span>
          </div>

          <p className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em] text-text">
            {workoutAdherence !== null && workoutAdherence !== undefined
              ? `${workoutAdherence}%`
              : "—"}
          </p>

          <p className="mt-1 text-xs text-muted">Platform workout adherence</p>
        </div>

        <div className="rounded-2xl bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <Utensils size={19} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Nutrition
            </span>
          </div>

          <p className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em] text-text">
            {dietAdherence !== null && dietAdherence !== undefined
              ? `${dietAdherence}%`
              : "—"}
          </p>

          <p className="mt-1 text-xs text-muted">Platform diet adherence</p>
        </div>
      </div>

      {/* Goal Distribution */}
      <section className="rounded-2xl bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
              <Target size={19} />
            </div>

            <div>
              <h2 className="font-display text-base font-semibold text-text">
                Goal Distribution
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                Primary fitness goals across user profiles
              </p>
            </div>
          </div>

          <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-medium text-muted">
            {totalProfiles} profiles
          </span>
        </div>

        {!data?.goalDistribution?.length ? (
          <div className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-muted">No profile data available yet.</p>
          </div>
        ) : (
          <div className="mt-7 flex flex-col gap-5">
            {data.goalDistribution.map((item) => {
              const percentage = totalProfiles
                ? Math.round((item.count / totalProfiles) * 100)
                : 0;

              return (
                <div key={item.goal}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-text">
                      {item.goal}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">{percentage}%</span>

                      <span className="min-w-5 text-right text-sm font-semibold text-text">
                        {item.count}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Adherence */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl bg-text p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary">
              <Dumbbell size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold">Workout Adherence</p>

              <p className="mt-0.5 text-xs text-white/50">
                Completed workouts over the last 30 days
              </p>
            </div>
          </div>

          <div className="mt-7 flex items-baseline gap-1">
            <span className="font-display text-4xl font-semibold tracking-[-0.03em]">
              {workoutAdherence !== null && workoutAdherence !== undefined
                ? workoutAdherence
                : "—"}
            </span>

            {workoutAdherence !== null && workoutAdherence !== undefined && (
              <span className="text-lg text-white/50">%</span>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-primary p-6 text-text">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-text/10">
              <Utensils size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold">Diet Adherence</p>

              <p className="mt-0.5 text-xs text-text/55">
                Followed diet logs over the last 30 days
              </p>
            </div>
          </div>

          <div className="mt-7 flex items-baseline gap-1">
            <span className="font-display text-4xl font-semibold tracking-[-0.03em]">
              {dietAdherence !== null && dietAdherence !== undefined
                ? dietAdherence
                : "—"}
            </span>

            {dietAdherence !== null && dietAdherence !== undefined && (
              <span className="text-lg text-text/55">%</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
