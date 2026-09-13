import { createContext, useContext, useState, useCallback } from "react";
import { CircleCheckBig, CircleAlert } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`card flex items-center gap-2 px-4 py-3 text-sm font-medium animate-[fadeIn_0.2s_ease] ${
              t.type === "error"
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
            style={{ minWidth: 260 }}
          >
            {t.type === "error" ? (
              <CircleAlert size={18} className="shrink-0 text-red-600" />
            ) : (
              <CircleCheckBig
                size={18}
                className="shrink-0 text-green-600"
              />
            )}

            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return ctx;
};
