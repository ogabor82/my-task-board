import { STATUS_STYLE } from "../constants/taskUi";

export default function TaskCard({ task, isActive = false, onClick }) {
  const style = STATUS_STYLE[task.status] || STATUS_STYLE.todo;
  const icon = task.icon || style.defaultIcon;

  return (
    <article
      className={`${style.container} shadow-soft flex items-start gap-4 rounded-2xl px-4 py-4 sm:px-5 ${
        isActive ? "ring-2 ring-[#3562df]" : ""
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#edf0f5] text-xl">
        {icon}
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
