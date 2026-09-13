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

const FIELDS = [
  { key: "waistCm", label: "Waist (cm)" },
  { key: "chestCm", label: "Chest (cm)" },
  { key: "hipsCm", label: "Hips (cm)" },
  { key: "armsCm", label: "Arms (cm)" },
  { key: "thighsCm", label: "Thighs (cm)" },
];

export default function Measurements() {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await progressService.getProgress(12);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load measurement data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form)
          .filter(([, v]) => v !== "" && v !== undefined)
          .map(([k, v]) => [k, Number(v)])
      );
      await progressService.logMeasurements(payload);
      showToast("Measurements updated");
      setForm({});
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to save your measurements.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const logs = data?.measurementLogs || [];
  const first = logs[0];
  const latest = logs[logs.length - 1];

  const chartData = logs.map((l) => ({
    date: new Date(l.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    waist: l.waistCm,
    chest: l.chestCm,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Body Measurements</h1>
        <p className="text-sm text-muted mt-1">
          Weight alone doesn't tell the full story — especially for muscle gain and body recomposition.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4">
          {FIELDS.map((f) => (
            <Input
              key={f.key}
              label={f.label}
              type="number"
              step="0.1"
              value={form[f.key] || ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          ))}
          <Button type="submit" disabled={saving} className="sm:col-span-3 self-start">
            {saving ? "Saving..." : "Save Measurements"}
          </Button>
        </form>
      </Card>

      {logs.length === 0 ? (
        <EmptyState title="No measurement data yet" description="Log your first measurement to start seeing your transformation." />
      ) : (
        <>
          {first && latest && first !== latest && (
            <Card>
              <h2 className="font-semibold mb-3">Change Since Starting</h2>
              <div className="grid sm:grid-cols-5 gap-4 text-sm">
                {FIELDS.map((f) => {
                  const start = first[f.key];
                  const current = latest[f.key];
                  const change = start != null && current != null ? (current - start).toFixed(1) : null;
                  return (
                    <div key={f.key}>
                      <p className="text-xs text-muted uppercase">{f.label}</p>
                      <p className="font-semibold">{change !== null ? `${change > 0 ? "+" : ""}${change} cm` : "—"}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card>
            <h2 className="font-semibold mb-4">Waist & Chest Trend</h2>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef1f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="waist" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="chest" stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
