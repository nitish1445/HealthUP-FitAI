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
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";

const WINDOWS = [
  { label: "4 weeks", value: 4 },
  { label: "8 weeks", value: 8 },
  { label: "12 weeks", value: 12 },
];

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15";

const Button = ({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-text transition-all duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);

const LoadingState = () => (
  <div className="flex w-full flex-col gap-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="h-7 w-32 animate-pulse rounded-lg bg-border/60" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-border/50" />
      </div>

      <div className="h-10 w-48 animate-pulse rounded-xl bg-border/50" />
    </div>

    <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)]">
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-border/60" />
      <div className="h-12 animate-pulse rounded-xl bg-border/40" />
    </div>

    <div className="h-80 animate-pulse rounded-2xl bg-surface shadow-[0_4px_20px_rgba(23,32,27,0.05)]" />

    <div className="grid gap-4 sm:grid-cols-2">
      <div className="h-28 animate-pulse rounded-2xl bg-surface" />
      <div className="h-28 animate-pulse rounded-2xl bg-surface" />
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-90 w-full flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center shadow-[0_4px_20px_rgba(23,32,27,0.05)]">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
      !
    </div>

    <h2 className="text-lg font-semibold text-text">Unable to load progress</h2>

    <p className="mt-2 max-w-md text-sm leading-6 text-muted">{message}</p>

    <Button onClick={onRetry} className="mt-5">
      Try Again
    </Button>
  </div>
);

const EmptyChart = () => (
  <div className="flex h-60 flex-col items-center justify-center rounded-xl bg-background px-6 text-center sm:h-70">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-light text-secondary-dark">
      <span className="text-lg font-semibold">↗</span>
    </div>

    <h3 className="mt-3 text-sm font-semibold text-text">
      No progress data yet
    </h3>

    <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
      Log your first weight entry to start seeing your transformation over time.
    </p>
  </div>
);

const MetricCard = ({ label, value, suffix }) => (
  <div className="rounded-2xl bg-surface p-5 text-center shadow-[0_4px_20px_rgba(23,32,27,0.05)] sm:p-6">
    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
      {label}
    </p>

    <p className="mt-2 text-2xl font-semibold tracking-tight text-text">
      {value}
      {value !== "—" && suffix && (
        <span className="ml-0.5 text-sm font-medium text-muted">{suffix}</span>
      )}
    </p>
  </div>
);

export default function Progress() {
  const { showToast } = useToast();

  const [weeks, setWeeks] = useState(4);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    async (w, isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const res = await api.get(`/progress?weeks=${w}`);

        setData(res.data.data);

        if (isRefresh) {
          showToast("Progress data refreshed successfully.");
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Unable to load progress data.";

        setError(message);

        if (isRefresh) {
          showToast(message, "error");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    load(weeks);
  }, [weeks, load]);

  const handleWindowChange = (value) => {
    if (value === weeks) return;
    setWeeks(value);
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();

    if (!weightInput) {
      showToast("Enter your current weight.", "error");
      return;
    }

    const weightKg = Number(weightInput);

    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      showToast("Enter a valid weight.", "error");
      return;
    }

    setSaving(true);

    try {
      await api.post("/progress/weight", {
        weightKg,
      });

      showToast("Weight logged successfully.");
      setWeightInput("");

      await load(weeks);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Unable to save your weight.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) {
    return <LoadingState />;
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={() => load(weeks)} />;
  }

  const chartData = (data?.weightLogs || []).map((log) => ({
    date: new Date(log.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    weight: log.weightKg,
  }));

  const workoutCompletion =
    data?.workoutCompletionPct !== null &&
    data?.workoutCompletionPct !== undefined
      ? data.workoutCompletionPct
      : "—";

  const dietAdherence =
    data?.dietAdherencePct !== null && data?.dietAdherencePct !== undefined
      ? data.dietAdherencePct
      : "—";

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Progress
          </h1>

          <p className="mt-1 text-sm leading-6 text-muted">
            Your real, logged trends over time.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid grid-cols-3 rounded-xl bg-surface p-1 shadow-[0_3px_14px_rgba(23,32,27,0.05)]">
            {WINDOWS.map((window) => (
              <button
                key={window.value}
                type="button"
                onClick={() => handleWindowChange(window.value)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 sm:px-4 ${
                  weeks === window.value
                    ? "bg-primary text-text"
                    : "text-muted hover:bg-surface-soft hover:text-text"
                }`}
              >
                {window.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => load(weeks, true)}
            disabled={refreshing}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-[0_3px_14px_rgba(23,32,27,0.05)] transition-all duration-200 hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <section className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)] sm:p-6">
        <div className="mb-5">
          <h2 className="font-semibold text-text">Log Today's Weight</h2>

          <p className="mt-1 text-xs leading-5 text-muted">
            Keep your weight history updated to make your progress more
            meaningful.
          </p>
        </div>

        <form
          onSubmit={handleLogWeight}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="block w-full sm:max-w-xs">
            <span className="mb-1.5 block text-xs font-medium text-text-secondary">
              Weight (kg)
            </span>

            <input
              type="number"
              min="1"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="e.g. 74.5"
              className={inputClass}
            />
          </label>

          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? "Saving..." : "Log Weight"}
          </Button>
        </form>
      </section>

      <section className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)] sm:p-6">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-semibold text-text">Weight Trend</h2>

            <p className="mt-1 text-xs text-muted">
              Your logged weight over the selected period.
            </p>
          </div>

          <span className="text-xs font-medium text-muted">
            Last {weeks} weeks
          </span>
        </div>

        {chartData.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-60 w-full sm:h-70">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                <XAxis
                  dataKey="date"
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
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [`${value} kg`, "Weight"]}
                  contentStyle={{
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 6px 24px rgba(23,32,27,0.10)",
                    fontSize: "12px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight"
                  stroke="var(--success-dark)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Workout Completion"
          value={workoutCompletion}
          suffix="%"
        />

        <MetricCard label="Diet Adherence" value={dietAdherence} suffix="%" />
      </div>

      {chartData.length > 0 && (
        <section className="rounded-2xl bg-surface-soft p-5 sm:p-6">
          <p className="text-sm font-semibold text-text">
            Keep the trend going
          </p>

          <p className="mt-1 text-xs leading-5 text-muted">
            Consistent logging gives HealthUP better information to understand
            your progress and adjust your journey over time.
          </p>
        </section>
      )}
    </div>
  );
}
