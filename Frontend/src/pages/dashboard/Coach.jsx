import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  MessageCircle,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import api from "../../config/Api";
import { useToast } from "../../context/ToastContext";

const CHIPS = [
  "Why am I plateauing?",
  "Should I increase protein?",
  "Can I skip cardio?",
  "Why am I fatigued?",
];

export default function Coach() {
  const { showToast } = useToast();

  const [context, setContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const loadContext = useCallback(async () => {
    setLoadingContext(true);

    try {
      const res = await api.get("/coach/context");

      setContext(res.data?.data || res.data);
    } catch (err) {
      console.error(
        "Coach context error:",
        err.response?.data?.message || err.message,
      );
    } finally {
      setLoadingContext(false);
    }
  }, []);

  useEffect(() => {
    loadContext();
  }, [loadContext]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, sending]);

  const send = async (text) => {
    const message = (text ?? input).trim();

    if (!message || sending) return;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setSending(true);

    try {
      const res = await api.post("/coach/message", {
        message,
      });

      const answer =
        res.data?.data?.answer ||
        res.data?.answer ||
        "I couldn't generate a response right now.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Unable to reach HealthUP Coach.",
        "error",
      );
    } finally {
      setSending(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles size={15} className="text-primary-dark" />

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-dark">
              Personal AI Coach
            </p>
          </div>

          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text sm:text-3xl">
            HealthUP Coach
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Ask questions about your training, nutrition, recovery, or progress.
            Your coach uses your actual HealthUP data to give relevant guidance.
          </p>
        </div>
      </div>

      {/* Context */}
      {!loadingContext && context && (
        <section className="rounded-2xl bg-surface px-4 py-3 shadow-[0_5px_20px_rgba(23,32,27,0.04)] sm:px-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-primary-dark" />

              <span className="text-xs text-muted">Habit score</span>

              <span className="text-xs font-semibold text-text">
                {context.habitScore ?? "—"}
              </span>
            </div>

            <div className="hidden h-4 w-px bg-border sm:block" />

            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-success-dark" />

              <span className="text-xs text-muted">Workout</span>

              <span className="text-xs font-semibold text-text">
                {context.workoutAdherence ?? "—"}%
              </span>
            </div>

            <div className="hidden h-4 w-px bg-border sm:block" />

            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-secondary-dark" />

              <span className="text-xs text-muted">Diet</span>

              <span className="text-xs font-semibold text-text">
                {context.dietAdherence ?? "—"}%
              </span>
            </div>

            <div className="hidden h-4 w-px bg-border sm:block" />

            <div className="flex items-center gap-2">
              <Activity size={15} className="text-primary-dark" />

              <span className="text-xs text-muted">Weight trend</span>

              <span className="text-xs font-semibold text-text">
                {context.weightTrendKgPerWeek ?? "—"} kg/wk
              </span>
            </div>
          </div>
        </section>
      )}

      {loadingContext && (
        <div className="h-12 animate-pulse rounded-2xl bg-surface-soft" />
      )}

      {/* Chat */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_8px_30px_rgba(23,32,27,0.06)]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-text">
            <Bot size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold text-text">HealthUP Coach</p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />

              <span className="text-[11px] text-muted">Ready to help</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Messages */}
        <div className="flex min-h-90 flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
                <MessageCircle size={27} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-text">
                What can I help you with?
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                Ask HealthUP Coach anything about your workouts, nutrition,
                recovery, or recent progress.
              </p>

              <div className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
                {CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => send(chip)}
                    disabled={sending}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-background px-4 py-3 text-left text-xs font-medium text-text transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>{chip}</span>

                    <Send size={14} className="shrink-0 text-muted" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex items-end gap-2.5 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                        <Bot size={15} />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-line sm:max-w-[75%] ${
                        isUser
                          ? "rounded-br-md bg-primary text-text"
                          : "rounded-bl-md bg-background text-text"
                      }`}
                    >
                      {message.content}
                    </div>

                    {isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-light text-secondary-dark">
                        <UserRound size={15} />
                      </div>
                    )}
                  </div>
                );
              })}

              {sending && (
                <div className="flex items-end gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                    <Bot size={15} />
                  </div>

                  <div className="rounded-2xl rounded-bl-md bg-background px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Quick Chips */}
        {messages.length > 0 && (
          <div className="overflow-x-auto px-4 pb-3 sm:px-6">
            <div className="flex min-w-max gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => send(chip)}
                  disabled={sending}
                  className="cursor-pointer whitespace-nowrap rounded-full bg-background px-3.5 py-2 text-xs font-medium text-muted transition-colors hover:bg-primary-light hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-surface px-4 pb-4 pt-1 sm:px-6 sm:pb-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="flex items-center gap-2 rounded-2xl bg-background p-1.5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask HealthUP Coach..."
              disabled={sending}
              className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-text outline-none placeholder:text-muted disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary text-text transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={17} />
            </button>
          </form>

          <p className="mt-2 text-center text-[10px] text-muted">
            HealthUP Coach uses your available fitness data to personalize
            responses.
          </p>
        </div>
      </section>
    </div>
  );
}
