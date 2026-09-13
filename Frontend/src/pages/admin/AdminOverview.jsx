import { useEffect, useState, useCallback } from "react";
import * as adminService from "../../services/adminService";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import { Users, Activity, Target } from "lucide-react";

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getOverview();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin overview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Skeleton className="h-72" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Admin Overview</h1>
        <p className="text-sm text-muted mt-1">Platform-wide analytics and oversight.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={data.totalUsers} icon={Users} />
        <StatCard label="Active Users (30d)" value={data.activeUsers} icon={Activity} />
        <StatCard label="Workout Adherence" value={data.platformWorkoutAdherencePct !== null ? `${data.platformWorkoutAdherencePct}%` : "—"} icon={Target} />
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Goal Distribution</h2>
        {data.goalDistribution.length === 0 ? (
          <p className="text-sm text-muted">No profile data yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {data.goalDistribution.map((g) => (
              <div key={g.goal} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                <span>{g.goal}</span>
                <span className="font-medium">{g.count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
