import { useEffect, useState, useCallback } from "react";
import { Flag } from "lucide-react";
import * as analyticsService from "../../services/analyticsService";
import Card from "../../components/common/Card";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

export default function Roadmap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getRoadmap();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your roadmap.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <EmptyState title="Complete your profile to see a roadmap" description="Your personalized 8-week roadmap will appear here." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">8-Week Roadmap</h1>
        <p className="text-sm text-muted mt-1">Goal: {data.goal}</p>
      </div>

      <div className="flex flex-col">
        {data.weeks.map((w, i) => (
          <div key={w.week} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary-dark flex items-center justify-center text-xs font-semibold shrink-0">
                {w.week}
              </div>
              {i < data.weeks.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
            </div>
            <Card className="mb-4 flex-1">
              <p className="font-semibold text-sm mb-2">Week {w.week}</p>
              <p className="text-sm text-muted mb-1">Training: {w.intensityNote}</p>
              <p className="text-sm text-muted">Nutrition: {w.dietNote}</p>
              {w.milestone && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary-dark">
                  <Flag size={14} /> {w.milestone}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
