import { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Flame,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Dumbbell,
  Utensils,
  TrendingUp,
} from "lucide-react";
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";

const RISK_LABEL = {
  none: "On Track",
  at_risk: "At Risk",
  high_risk: "High Risk",
};

export default function Habits() {
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (showSuccessToast = false) => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/habits");
        setData(res.data.data);

        if (showSuccessToast) {
          showToast("Habit data refreshed successfully.");
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || "Unable to load your habit data.";

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-8 w-28 animate-pulse rounded-lg bg-surface-soft" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-surface-soft" />
          </div>

          <div className="h-9 w-24 animate-pulse rounded-xl bg-surface-soft" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>

        <div className="h-85 animate-pulse rounded-2xl bg-surface" />
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
          Unable to load habits
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

  if (!data?.current) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary-dark">
          <Activity size={21} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-text">
          No habit data yet
        </h2>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted">
          Start logging your workouts and meals to build your habit score and
          consistency history.
        </p>
      </div>
    );
  }

  const { current, history = [] } = data;

  const chartData = [...history].reverse().map((h) => ({
    week: new Date(h.weekStart).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    score: h.habitScore,
  }));

  const riskStatus = current.riskStatus || "none";
  const riskLabel = RISK_LABEL[riskStatus] || "On Track";

  const riskConfig = {
    none: {
      icon: ShieldCheck,
      wrapper: "bg-success-light",
      iconColor: "text-success-dark",
      badge: "text-success-dark",
    },
    at_risk: {
      icon: AlertTriangle,
      wrapper: "bg-primary-light",
      iconColor: "text-primary-dark",
      badge: "text-primary-dark",
    },
    high_risk: {
      icon: AlertTriangle,
      wrapper: "bg-danger-light",
      iconColor: "text-danger",
      badge: "text-danger",
    },
  };

  const config = riskConfig[riskStatus] || riskConfig.none;
  const RiskIcon = config.icon;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-text">
            Habits
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
            Habit Score = Workout Adherence x 0.60 + Diet Adherence x 0.40
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading}
          className="group inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-surface px-3 text-xs font-medium text-muted transition-all duration-200 hover:bg-surface-soft hover:text-text active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Refresh habit data"
          title="Refresh habit data"
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

      {/* Main stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <TrendingUp size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Weekly Score
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold tracking-[-0.03em] text-text">
              {current.habitScore ?? 0}
              <span className="ml-1 text-sm font-medium text-muted">/100</span>
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-success transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(current.habitScore || 0, 0),
                  100,
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
              <Flame size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Current Streak
            </span>
          </div>

          <p className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-text">
            {current.streak ?? 0}
          </p>

          <p className="mt-1 text-xs text-muted">
            day{current.streak === 1 ? "" : "s"} of consistency
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.wrapper} ${config.iconColor}`}
            >
              <RiskIcon size={18} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              Risk Status
            </span>
          </div>

          <div className="mt-5">
            <span className={`text-sm font-semibold ${config.badge}`}>
              {riskLabel}
            </span>
          </div>

          <p className="mt-2 text-xs text-muted">Based on recent consistency</p>
        </div>
      </div>

      {/* Adherence */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                <Dumbbell size={16} />
              </div>

              <div>
                <p className="text-sm font-semibold text-text">
                  Workout Adherence
                </p>

                <p className="mt-0.5 text-[11px] text-muted">
                  Training consistency
                </p>
              </div>
            </div>

            <p className="text-xl font-semibold text-text">
              {current.workoutAdherence ?? 0}%
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(current.workoutAdherence || 0, 0),
                  100,
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
                <Utensils size={16} />
              </div>

              <div>
                <p className="text-sm font-semibold text-text">
                  Diet Adherence
                </p>

                <p className="mt-0.5 text-[11px] text-muted">
                  Nutrition consistency
                </p>
              </div>
            </div>

            <p className="text-xl font-semibold text-text">
              {current.dietAdherence ?? 0}%
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-500"
              style={{
                width: `${Math.min(
                  Math.max(current.dietAdherence || 0, 0),
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Trend */}
      <div className="rounded-2xl bg-surface p-4 shadow-[0_4px_24px_rgba(23,32,27,0.04)] sm:p-6">
        <div className="mb-5">
          <h2 className="font-display text-base font-semibold text-text">
            Monthly Trend
          </h2>

          <p className="mt-1 text-xs text-muted">
            Your habit score over recent weeks.
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-background text-muted">
              <BarChart size={19} />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-text">
              No habit history yet
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
              Log workouts and meals for a few weeks to see your consistency
              trend.
            </p>
          </div>
        ) : (
          <div className="h-60 w-full sm:h-70">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 8,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                <XAxis
                  dataKey="week"
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted)",
                  }}
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: "var(--background)" }}
                  contentStyle={{
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 6px 24px rgba(23,32,27,0.08)",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="score"
                  fill="var(--success)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Risk message */}
      {riskStatus !== "none" && (
        <div
          className={`rounded-2xl p-5 sm:p-6 ${
            riskStatus === "high_risk" ? "bg-danger-light" : "bg-primary-light"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                riskStatus === "high_risk"
                  ? "bg-danger/10 text-danger"
                  : "bg-primary/10 text-primary-dark"
              }`}
            >
              <AlertTriangle size={17} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text">
                We noticed a drop in consistency
              </h3>

              <p className="mt-1 text-sm leading-6 text-muted">
                {riskStatus === "high_risk"
                  ? "It looks like it's been a while, or a few sessions were missed in a row. Consider a lighter plan or resetting your schedule — small consistent steps beat an all-or-nothing approach."
                  : "Diet adherence has been lower than usual over the last two weeks. That's completely normal — consider simplifying your meal plan this week."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
