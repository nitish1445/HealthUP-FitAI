import { useEffect, useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import * as analyticsService from "../../services/analyticsService";
import Card from "../../components/common/Card";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getAnalytics();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data?.hasData) {
    return <EmptyState title="Not enough data yet" description="Log workouts, meals, and weight for a few weeks to unlock analytics." />;
  }

  const habitChart = [...data.habitHistory].reverse().map((h) => ({
    week: new Date(h.weekStart).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: h.habitScore,
  }));

  const weightChart = data.weightLogs.map((l) => ({
    date: new Date(l.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    weight: l.weightKg,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Analytics</h1>
        <p className="text-sm text-muted mt-1">Deeper insights calculated from your real data.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-muted uppercase mb-2">Progress Velocity</p>
          <p className="text-2xl font-semibold">
            {data.velocityDeltaPct !== null ? `${data.velocityDeltaPct > 0 ? "+" : ""}${data.velocityDeltaPct}%` : "—"}
          </p>
          <p className="text-xs text-muted mt-1">vs. prior 4-week habit average</p>
        </Card>
        <Card>
          <p className="text-xs text-muted uppercase mb-2">Training Volume (8wk)</p>
          <p className="text-2xl font-semibold">{data.totalTrainingVolume}</p>
          <p className="text-xs text-muted mt-1">total reps × sets logged</p>
        </Card>
        <Card>
          <p className="text-xs text-muted uppercase mb-2">Diet Macro Accuracy</p>
          <p className="text-2xl font-semibold">{data.macroAccuracyPct !== null ? `${data.macroAccuracyPct}%` : "—"}</p>
          <p className="text-xs text-muted mt-1">followed or mostly followed</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Habit Score Trend (8 weeks)</h2>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={habitChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {weightChart.length > 0 && (
        <Card>
          <h2 className="font-semibold mb-4">Weight Trend (8 weeks)</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={weightChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
