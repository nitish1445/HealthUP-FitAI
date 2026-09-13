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

const FIELDS = [
  { key: "waistCm", label: "Waist (cm)" },
  { key: "chestCm", label: "Chest (cm)" },
  { key: "hipsCm", label: "Hips (cm)" },
  { key: "armsCm", label: "Arms (cm)" },
  { key: "thighsCm", label: "Thighs (cm)" },
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
  <div className="flex flex-col gap-6">
    <div>
      <div className="h-7 w-56 animate-pulse rounded-lg bg-border/60" />
      <div className="mt-2 h-4 w-full max-w-2xl animate-pulse rounded bg-border/50" />
    </div>

    <div className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)]">
      <div className="grid gap-4 sm:grid-cols-3">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-border/60" />
            <div className="h-12 animate-pulse rounded-xl bg-border/40" />
          </div>
        ))}
        <div className="h-12 animate-pulse rounded-xl bg-border/40 sm:col-span-3" />
      </div>
    </div>

    <div className="h-80 animate-pulse rounded-2xl bg-surface shadow-[0_4px_20px_rgba(23,32,27,0.05)]" />
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center shadow-[0_4px_20px_rgba(23,32,27,0.05)]">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
      !
    </div>
    <h2 className="text-lg font-semibold text-text">
      Unable to load measurements
    </h2>
    <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
    <Button onClick={onRetry} className="mt-5">
      Try Again
    </Button>
  </div>
);

const EmptyState = () => (
  <div className="rounded-2xl bg-surface px-6 py-12 text-center shadow-[0_4px_20px_rgba(23,32,27,0.05)]">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary-light text-secondary-dark">
      <span className="text-lg font-bold">M</span>
    </div>
    <h2 className="mt-4 text-lg font-semibold text-text">
      No measurement data yet
    </h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
      Log your first measurement to start seeing how your body is changing over
      time.
    </p>
  </div>
);

export default function Measurements() {
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const res = await api.get("/progress?weeks=12");
        setData(res.data.data);

        if (isRefresh) {
          showToast("Measurement data refreshed successfully.");
        }
      } catch (err) {
        const message =
          err.response?.data?.message || "Unable to load measurement data.";

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
    load();
  }, [load]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = Object.fromEntries(
      Object.entries(form)
        .filter(([, value]) => value !== "" && value !== undefined)
        .map(([key, value]) => [key, Number(value)]),
    );

    if (Object.keys(payload).length === 0) {
      showToast("Enter at least one measurement.", "error");
      return;
    }

    setSaving(true);

    try {
      await api.post("/progress/measurements", payload);

      showToast("Measurements updated successfully.");
      setForm({});
      await load();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Unable to save your measurements.",
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
    return <ErrorState message={error} onRetry={() => load()} />;
  }

  const logs = data?.measurementLogs || [];
  const first = logs[0];
  const latest = logs[logs.length - 1];

  const chartData = logs.map((log) => ({
    date: new Date(log.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    waist: log.waistCm,
    chest: log.chestCm,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Body Measurements
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
            Weight alone doesn't tell the full story — especially for muscle
            gain and body recomposition.
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-[0_3px_14px_rgba(23,32,27,0.05)] transition-all duration-200 hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <section className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)] sm:p-6">
        <div className="mb-5">
          <h2 className="font-semibold text-text">Log Measurements</h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Add the measurements you want to track. You can update only the
            values that changed.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FIELDS.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-1.5 block text-xs font-medium text-text-secondary">
                {field.label}
              </span>

              <input
                type="number"
                step="0.1"
                min="0"
                value={form[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder="Enter value"
                className={inputClass}
              />
            </label>
          ))}

          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Measurements"}
            </Button>
          </div>
        </form>
      </section>

      {logs.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {first && latest && first !== latest && (
            <section className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)] sm:p-6">
              <div className="mb-5">
                <h2 className="font-semibold text-text">
                  Change Since Starting
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Difference between your first and latest recorded
                  measurements.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {FIELDS.map((field) => {
                  const start = first[field.key];
                  const current = latest[field.key];

                  const change =
                    start != null && current != null
                      ? (current - start).toFixed(1)
                      : null;

                  return (
                    <div key={field.key}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                        {field.label}
                      </p>

                      <p className="mt-1 text-lg font-semibold text-text">
                        {change !== null
                          ? `${change > 0 ? "+" : ""}${change} cm`
                          : "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="rounded-2xl bg-surface p-5 shadow-[0_4px_20px_rgba(23,32,27,0.05)] sm:p-6">
            <div className="mb-5">
              <h2 className="font-semibold text-text">Waist & Chest Trend</h2>
              <p className="mt-1 text-xs text-muted">
                Track how your measurements are changing over time.
              </p>
            </div>

            {chartData.length < 2 ? (
              <div className="flex h-60 items-center justify-center rounded-xl bg-background px-6 text-center">
                <p className="max-w-sm text-sm leading-6 text-muted">
                  Add another measurement entry to see your body measurement
                  trend.
                </p>
              </div>
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
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />

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
                      contentStyle={{
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 6px 24px rgba(23,32,27,0.10)",
                        fontSize: "12px",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="waist"
                      name="Waist"
                      stroke="var(--success-dark)"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />

                    <Line
                      type="monotone"
                      dataKey="chest"
                      name="Chest"
                      stroke="var(--secondary-dark)"
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

          <section className="rounded-2xl bg-surface-soft p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-text">
                  Measurement history
                </p>
                <p className="mt-1 text-xs text-muted">
                  {logs.length} recorded{" "}
                  {logs.length === 1 ? "entry" : "entries"}
                </p>
              </div>

              {latest?.date && (
                <p className="text-xs font-medium text-muted">
                  Latest:{" "}
                  {new Date(latest.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
