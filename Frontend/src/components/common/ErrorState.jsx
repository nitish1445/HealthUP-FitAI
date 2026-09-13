import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center">
      <AlertTriangle size={28} className="text-danger" />
      <p className="text-sm text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
