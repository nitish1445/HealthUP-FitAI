import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  BarChart3,
  RefreshCw,
  TrendingUp,
  Utensils,
} from "lucide-react";
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showToast } = useToast();

  const load = useCallback(
    async (showSuccessToast = false) => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/analytics");
        setData(res.data.data);

        if (showSuccessToast) {
          showToast("Analytics refreshed successfully.");
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || "Unable to load analytics.";

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
        <div>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-surface-soft" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-surface-soft" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>

        <div className="h-85 animate-pulse rounded-2xl bg-surface" />
        <div className="h-85 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
          <BarChart3 size={21} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-text">
          Unable to load analytics
        </h2>

        <p className="mt-1 max-w-md text-sm text-muted">{error}</p>

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

  if (!data?.hasData) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary-dark">
          <Activity size={21} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-text">
          Not enough data yet
        </h2>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Log workouts, meals, and weight for a few weeks to unlock personalized
          analytics.
        </p>
      </div>
    );
  }

  const habitChart = [...(data.habitHistory || [])].reverse().map((h) => ({
    week: new Date(h.weekStart).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    score: h.habitScore,
  }));

  const weightChart = (data.weightLogs || []).map((l) => ({
    date: new Date(l.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    weight: l.weightKg,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-text">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-muted">
            Deeper insights calculated from your real data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading}
          className="group inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-surface px-3 text-xs font-medium text-muted transition-all duration-200 hover:bg-surface-soft hover:text-text active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Refresh analytics"
          title="Refresh analytics"
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

      {/* Insight cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <TrendingUp size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Velocity
            </span>
          </div>

          <p className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-text">
            {data.velocityDeltaPct !== null
              ? `${data.velocityDeltaPct > 0 ? "+" : ""}${data.velocityDeltaPct}%`
              : "—"}
          </p>

          <p className="mt-1 text-xs leading-5 text-muted">
            vs. prior 4-week habit average
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
              <Activity size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Training
            </span>
          </div>

          <p className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-text">
            {data.totalTrainingVolume ?? 0}
          </p>

          <p className="mt-1 text-xs leading-5 text-muted">
            total reps × sets logged · 8 weeks
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-light text-success-dark">
              <Utensils size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Nutrition
            </span>
          </div>

          <p className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-text">
            {data.macroAccuracyPct !== null ? `${data.macroAccuracyPct}%` : "—"}
          </p>

          <p className="mt-1 text-xs leading-5 text-muted">
            followed or mostly followed
          </p>
        </div>
      </div>

      {/* Habit chart */}
      {habitChart.length > 0 && (
        <div className="rounded-2xl bg-surface p-4 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-base font-semibold text-text">
              Habit Score Trend
            </h2>

            <p className="mt-1 text-xs text-muted">
              Your consistency score across the last 8 weeks.
            </p>
          </div>

          <div className="h-60 w-full sm:h-70">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={habitChart}
                margin={{ top: 5, right: 8, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 6px 24px rgba(23,32,27,0.08)",
                    fontSize: "12px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--success-dark)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Weight chart */}
      {weightChart.length > 0 && (
        <div className="rounded-2xl bg-surface p-4 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-base font-semibold text-text">
              Weight Trend
            </h2>

            <p className="mt-1 text-xs text-muted">
              Your recorded weight changes across the last 8 weeks.
            </p>
          </div>

          <div className="h-60 w-full sm:h-70">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weightChart}
                margin={{ top: 5, right: 8, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 6px 24px rgba(23,32,27,0.08)",
                    fontSize: "12px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--secondary-dark)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
