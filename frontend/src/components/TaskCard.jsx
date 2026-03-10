const STATUS_LOOKUP = {
  "in-progress": {
    icon: "⏰",
    badge: "◔",
    container: "bg-card",
    badgeBg: "bg-accent"
  },
  completed: {
    icon: "🏋️",
    badge: "✓",
    container: "bg-cardDone",
    badgeBg: "bg-accentDone"
  },
  "wont-do": {
    icon: "☕",
    badge: "✕",
    container: "bg-cardReject",
    badgeBg: "bg-accentReject"
  },
  todo: {
    icon: "📚",
    badge: null,
    container: "bg-cardTodo",
    badgeBg: "bg-cardTodo"
  }
};

export default function TaskCard({ task }) {
  const style = STATUS_LOOKUP[task.status] || STATUS_LOOKUP.todo;

  return (
    <article className={`${style.container} shadow-soft flex items-start gap-4 rounded-2xl px-4 py-4 sm:px-5`}>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#edf0f5] text-xl">
        {style.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-title text-[30px]/[1] font-semibold tracking-[-0.02em] sm:text-[36px]/[1]">
          {task.title}
        </h3>
        {task.description ? (
          <p className="text-text mt-2 text-[18px]/[1.35] font-normal sm:text-[19px]/[1.4]">
            {task.description}
          </p>
        ) : null}
      </div>
      {style.badge ? (
        <span className={`${style.badgeBg} grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl text-white`}>
          {style.badge}
        </span>
      ) : null}
    </article>
  );
}
