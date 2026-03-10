export const ICON_OPTIONS = ["🧑🏻‍💻", "💬", "☕", "🏋️", "📚", "⏰"];

export const STATUS_OPTIONS = [
  { value: "in-progress", label: "In Progress", badge: "◔", badgeBg: "bg-accent" },
  { value: "completed", label: "Completed", badge: "✓", badgeBg: "bg-accentDone" },
  { value: "wont-do", label: "Won't do", badge: "✕", badgeBg: "bg-accentReject" },
  { value: "todo", label: "To Do", badge: null, badgeBg: "bg-cardTodo" }
];

export const STATUS_STYLE = {
  "in-progress": {
    defaultIcon: "⏰",
    container: "bg-card",
    badge: "◔",
    badgeBg: "bg-accent"
  },
  completed: {
    defaultIcon: "🏋️",
    container: "bg-cardDone",
    badge: "✓",
    badgeBg: "bg-accentDone"
  },
  "wont-do": {
    defaultIcon: "☕",
    container: "bg-cardReject",
    badge: "✕",
    badgeBg: "bg-accentReject"
  },
  todo: {
    defaultIcon: "📚",
    container: "bg-cardTodo",
    badge: null,
    badgeBg: "bg-cardTodo"
  }
};
