import { useEffect, useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as progressService from "../../services/progressService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const WINDOWS = [
  { label: "4 weeks", value: 4 },
  { label: "8 weeks", value: 8 },
  { label: "12 weeks", value: 12 },
];

export default function Progress() {
  const { showToast } = useToast();
  const [weeks, setWeeks] = useState(4);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (w) => {
    setLoading(true);
    setError(null);
    try {
      const res = await progressService.getProgress(w);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load progress data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(weeks);
  }, [weeks, load]);

  const handleLogWeight = async (e) => {
    e.preventDefault();
    if (!weightInput) return;
    setSaving(true);
    try {
      await progressService.logWeight({ weightKg: Number(weightInput) });
      showToast("Weight logged successfully");
      setWeightInput("");
      load(weeks);
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to save your weight.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={() => load(weeks)} />;

  const chartData = (data?.weightLogs || []).map((l) => ({
    date: new Date(l.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    weight: l.weightKg,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">Progress</h1>
          <p className="text-sm text-muted mt-1">Your real, logged trends over time.</p>
        </div>
        <div className="flex gap-2">
          {WINDOWS.map((w) => (
            <button
              key={w.value}
              onClick={() => setWeeks(w.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                weeks === w.value ? "bg-primary text-white" : "bg-surface border border-gray-200 text-muted"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <form onSubmit={handleLogWeight} className="flex items-end gap-3 flex-wrap">
          <Input
            label="Log today's weight (kg)"
            type="number"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="e.g. 74.5"
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Log Weight"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Weight Trend</h2>
        {chartData.length === 0 ? (
          <EmptyState title="No progress data yet" description="Log your first weight entry to start seeing your transformation." />
        ) : (
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="text-center">
          <p className="text-xs text-muted uppercase">Workout Completion</p>
          <p className="text-2xl font-semibold mt-1">
            {data.workoutCompletionPct !== null ? `${data.workoutCompletionPct}%` : "—"}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-muted uppercase">Diet Adherence</p>
          <p className="text-2xl font-semibold mt-1">
            {data.dietAdherencePct !== null ? `${data.dietAdherencePct}%` : "—"}
          </p>
        </Card>
      </div>
    </div>
  );
}
