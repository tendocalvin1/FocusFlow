import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  FOCUS_SETTINGS_STORAGE_KEY,
  defaultFocusSettings,
  focusModes,
} from "@/constants/focusConstants";
import { mockFocusSessions, mockFocusStats } from "@/data/mockSessions";

const FocusTimerContext = createContext(null);

function loadSettings() {
  try {
    const saved = localStorage.getItem(FOCUS_SETTINGS_STORAGE_KEY);
    return saved ? { ...defaultFocusSettings, ...JSON.parse(saved) } : defaultFocusSettings;
  } catch {
    return defaultFocusSettings;
  }
}

function getModeDuration(mode, settings) {
  const modeConfig = focusModes.find((item) => item.id === mode) || focusModes[0];
  return settings[modeConfig.settingsKey] * 60;
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function FocusTimerProvider({ children }) {
  const [mode, setMode] = useState("pomodoro");
  const [settings, setSettings] = useState(loadSettings);
  const [duration, setDuration] = useState(() => getModeDuration("pomodoro", loadSettings()));
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("Deep Work: Core Frontend Features");
  const [history, setHistory] = useState(mockFocusSessions);
  const snapshotRef = useRef({ mode, duration, sessionTitle, settings });

  useEffect(() => {
    localStorage.setItem(FOCUS_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    snapshotRef.current = { mode, duration, sessionTitle, settings };
  }, [duration, mode, sessionTitle, settings]);

  const completeSession = (status = "completed") => {
    const snapshot = snapshotRef.current;
    const now = new Date();
    const durationMinutes = Math.round(snapshot.duration / 60);

    setHistory((items) => [
      {
        id: Date.now(),
        title: snapshot.sessionTitle || "Focus Session",
        mode: snapshot.mode,
        durationMinutes,
        duration: `${durationMinutes} min`,
        status,
        completedAt: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: now.toISOString().slice(0, 10),
        tag: snapshot.mode === "pomodoro" || snapshot.mode === "custom" ? "Work" : "Recovery",
      },
      ...items,
    ]);
  };

  useEffect(() => {
    if (!isActive) return undefined;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        completeSession("completed");
        setIsActive(false);
        setHasStarted(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const changeMode = (newMode) => {
    const nextDuration = getModeDuration(newMode, settings);
    setMode(newMode);
    setDuration(nextDuration);
    setTimeLeft(nextDuration);
    setIsActive(false);
    setHasStarted(false);
  };

  const updateSettings = (nextSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...nextSettings };
      const nextDuration = getModeDuration(mode, updated);
      setDuration(nextDuration);
      setTimeLeft(nextDuration);
      setIsActive(false);
      setHasStarted(false);
      return updated;
    });
  };

  const startTimer = () => {
    setHasStarted(true);
    setIsActive(true);
  };

  const pauseTimer = () => setIsActive(false);
  const resumeTimer = () => setIsActive(true);

  const resetTimer = () => {
    setIsActive(false);
    setHasStarted(false);
    setTimeLeft(duration);
  };

  const skipBreak = () => {
    if (mode === "shortBreak" || mode === "longBreak") {
      changeMode("pomodoro");
    }
  };

  const todayKey = getTodayKey();
  const todaySessions = history.filter((session) => session.date === todayKey);
  const completedSessions = history.filter((session) => session.status === "completed");

  const stats = useMemo(() => {
    const todayFocusMinutes = todaySessions
      .filter((session) => session.status === "completed")
      .reduce((total, session) => total + session.durationMinutes, 0);
    const weekFocusMinutes = completedSessions.reduce(
      (total, session) => total + session.durationMinutes,
      0
    );
    const completedPomodoros = completedSessions.filter(
      (session) => session.mode === "pomodoro"
    ).length;

    return {
      todayFocusMinutes,
      weekFocusMinutes,
      completedPomodoros,
      currentStreak: mockFocusStats.currentStreak,
      longestStreak: mockFocusStats.longestStreak,
      averageDailyFocusMinutes: Math.round(weekFocusMinutes / 7),
    };
  }, [completedSessions, todaySessions]);

  return (
    <FocusTimerContext.Provider
      value={{
        mode,
        duration,
        timeLeft,
        isActive,
        hasStarted,
        sessionTitle,
        settings,
        history,
        todaySessions,
        stats,
        setSessionTitle,
        changeMode,
        pauseTimer,
        resetTimer,
        resumeTimer,
        skipBreak,
        startTimer,
        updateSettings,
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
