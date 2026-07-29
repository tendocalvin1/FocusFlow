export const FOCUS_SETTINGS_STORAGE_KEY = "focusflow_timer_settings";

export const defaultFocusSettings = {
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  customMinutes: 45,
  autoStartBreaks: false,
  autoStartNextSession: false,
  notifications: true,
  sound: true,
};

export const focusModes = [
  {
    id: "pomodoro",
    label: "Pomodoro",
    shortLabel: "Focus",
    description: "25 min focus / 5 min break",
    settingsKey: "pomodoroMinutes",
  },
  {
    id: "shortBreak",
    label: "Short Break",
    shortLabel: "Break",
    description: "Quick recovery interval",
    settingsKey: "shortBreakMinutes",
  },
  {
    id: "longBreak",
    label: "Long Break",
    shortLabel: "Reset",
    description: "Longer recovery after deep work",
    settingsKey: "longBreakMinutes",
  },
  {
    id: "custom",
    label: "Custom Timer",
    shortLabel: "Custom",
    description: "Flexible focus block",
    settingsKey: "customMinutes",
  },
];

export const focusModeLabels = focusModes.reduce((labels, mode) => {
  labels[mode.id] = mode.label;
  return labels;
}, {});

export const focusStatusLabels = {
  completed: "Completed",
  skipped: "Skipped",
  interrupted: "Interrupted",
};
