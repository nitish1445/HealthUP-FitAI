import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import * as intelligenceService from "../../services/intelligenceService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

export default function Settings() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [evaluating, setEvaluating] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const res = await intelligenceService.evaluatePlan();
      const count = res.data.adjustments.length;
      showToast(count > 0 ? `Plan regenerated with ${count} adjustment(s)` : "Evaluation complete — no adjustments needed");
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to run evaluation.", "error");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-semibold text-text">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your account and preferences.</p>
      </div>

      <Card>
        <h2 className="font-semibold mb-3">Account</h2>
        <div className="text-sm text-text flex flex-col gap-1">
          <p><span className="text-muted">Name:</span> {user?.name}</p>
          <p><span className="text-muted">Email:</span> {user?.email}</p>
          <p><span className="text-muted">Role:</span> {user?.role}</p>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Weekly Plan Evaluation</h2>
        <p className="text-sm text-muted mb-3">
          Runs automatically every week. You can also trigger it manually to check for adjustments right now.
        </p>
        <Button variant="secondary" onClick={handleEvaluate} disabled={evaluating}>
          {evaluating ? "Evaluating..." : "Run Evaluation Now"}
        </Button>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Session</h2>
        <Button variant="danger" onClick={handleLogout}>
          Log Out
        </Button>
      </Card>
    </div>
  );
}
