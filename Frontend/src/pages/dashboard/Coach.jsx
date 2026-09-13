import { useEffect, useRef, useState, useCallback } from "react";
import { Send } from "lucide-react";
import * as intelligenceService from "../../services/intelligenceService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Skeleton from "../../components/common/Skeleton";

const CHIPS = ["Why am I plateauing?", "Should I increase protein?", "Can I skip cardio?", "Why am I fatigued?"];

export default function Coach() {
  const { showToast } = useToast();
  const [context, setContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadContext = useCallback(async () => {
    setLoadingContext(true);
    try {
      const res = await intelligenceService.getCoachContext();
      setContext(res.data);
    } catch {
      // context is optional decoration; coach still works without it
    } finally {
      setLoadingContext(false);
    }
  }, []);

  useEffect(() => {
    loadContext();
  }, [loadContext]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const message = text ?? input;
    if (!message.trim()) return;
    setMessages((m) => [...m, { role: "user", content: message }]);
    setInput("");
    setSending(true);
    try {
      const res = await intelligenceService.sendCoachMessage(message);
      setMessages((m) => [...m, { role: "assistant", content: res.data.answer }]);
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to reach FitAI Coach.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-160px)]">
      <div>
        <h1 className="text-2xl font-semibold text-text">Coach</h1>
        <p className="text-sm text-muted mt-1">Grounded in your actual adherence, trend, and recovery data.</p>
      </div>

      {!loadingContext && context && (
        <Card className="text-xs text-muted flex flex-wrap gap-x-4 gap-y-1">
          <span>Habit score: {context.habitScore ?? "—"}</span>
          <span>Workout adherence: {context.workoutAdherence ?? "—"}%</span>
          <span>Diet adherence: {context.dietAdherence ?? "—"}%</span>
          <span>Weight trend: {context.weightTrendKgPerWeek ?? "—"} kg/wk</span>
        </Card>
      )}
      {loadingContext && <Skeleton className="h-10" />}

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {messages.length === 0 && (
            <p className="text-sm text-muted text-center mt-8">
              Ask FitAI anything about your training, nutrition, or recovery.
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                  m.role === "user" ? "bg-primary text-white" : "bg-gray-100 text-text"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {sending && <div className="text-xs text-muted">FitAI is thinking...</div>}
          <div ref={bottomRef} />
        </div>

        <div className="mt-3 flex gap-2 flex-wrap">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => send(chip)}
              disabled={sending}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs text-muted hover:text-text hover:border-gray-300 transition"
            >
              {chip}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask FitAI..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button
            type="submit"
            disabled={sending}
            className="btn-primary rounded-xl p-2.5 disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </Card>
    </div>
  );
}
