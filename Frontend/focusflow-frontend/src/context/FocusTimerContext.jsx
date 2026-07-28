import { createContext, useContext, useEffect, useRef, useState } from "react";

const FocusTimerContext = createContext(null);

export function FocusTimerProvider({ children }) {
  const [mode, setMode] = useState("pomodoro"); // 'pomodoro' | 'shortBreak' | 'longBreak'
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(4);
  const [sessionTitle, setSessionTitle] = useState("Deep Work: Core Frontend Features");
  const timerSnapshotRef = useRef({
    mode,
    duration,
    sessionTitle,
  });

  const [history, setHistory] = useState([
    { id: 1, title: "DRF Authentication Specs", duration: "25 min", tag: "Backend", completedAt: "10:30 AM" },
    { id: 2, title: "Tailwind CSS v4 Token Mapping", duration: "45 min", tag: "Design", completedAt: "11:40 AM" },
    { id: 3, title: "Dashboard Responsive Layouts", duration: "25 min", tag: "Frontend", completedAt: "02:15 PM" },
  ]);

  useEffect(() => {
    timerSnapshotRef.current = {
      mode,
      duration,
      sessionTitle,
    };
  }, [mode, duration, sessionTitle]);

  useEffect(() => {
    if (!isActive) return undefined;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        setIsActive(false);

        const snapshot = timerSnapshotRef.current;
        if (snapshot.mode === "pomodoro") {
          setSessionCount((count) => count + 1);

        const newLog = {
          id: Date.now(),
            title: snapshot.sessionTitle || "Focus Session",
            duration: `${Math.round(snapshot.duration / 60)} min`,
          tag: "Work",
          completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
          setHistory((historyItems) => [newLog, ...historyItems]);
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const changeMode = (newMode, minutes) => {
    setMode(newMode);
    const secs = minutes * 60;
    setDuration(secs);
    setTimeLeft(secs);
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  return (
    <FocusTimerContext.Provider
      value={{
        mode,
        duration,
        timeLeft,
        isActive,
        sessionCount,
        sessionTitle,
        setSessionTitle,
        history,
        changeMode,
        toggleTimer,
        resetTimer,
      }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
}

export function useFocusTimer() {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error("useFocusTimer must be used within a FocusTimerProvider");
  }
  return context;
}
