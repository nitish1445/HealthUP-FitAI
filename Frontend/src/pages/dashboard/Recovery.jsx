import { useEffect, useState, useCallback } from "react";
import * as intelligenceService from "../../services/intelligenceService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";

const LEVELS = ["Energized", "Normal", "Slightly Fatigued", "Very Tired"];

export default function Recovery() {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await intelligenceService.getRecovery();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load recovery data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCheckIn = async (level) => {
    setSubmitting(true);
    try {
      await intelligenceService.checkInEnergy({ energyLevel: level });
      showToast(level === "Very Tired" || level === "Slightly Fatigued" ? "Recovery day applied" : "Check-in saved");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to save your check-in.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Skeleton className="h-96" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Recovery</h1>
        <p className="text-sm text-muted mt-1">Check in daily so FitAI can adjust your training intensity.</p>
      </div>

      <Card>
        <h2 className="font-semibold mb-3">How are you feeling today?</h2>
        <div className="flex gap-2 flex-wrap">
          {LEVELS.map((level) => (
            <Button
              key={level}
              variant={data?.todayEnergyLevel === level ? "primary" : "secondary"}
              onClick={() => handleCheckIn(level)}
              disabled={submitting}
            >
              {level}
            </Button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Recommendation</h2>
        <p className="text-sm text-text">{data.hasData ? data.recommendation : data.message}</p>
        {data.forceRecoveryDay && (
          <div className="mt-3">
            <Badge tone="warning">Forced Recovery Day Active</Badge>
          </div>
        )}
      </Card>

      {data.hasData && (
        <Card>
          <h2 className="font-semibold mb-3">Recent Fatigue Flags (7 days)</h2>
          <p className="text-2xl font-semibold mb-1">{data.fatigueFlags}</p>
          <p className="text-xs text-muted">3 or more flags within 7 days triggers a forced recovery day.</p>
        </Card>
      )}
    </div>
  );
}
