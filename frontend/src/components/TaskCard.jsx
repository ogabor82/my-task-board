import { STATUS_STYLE } from "../constants/taskUi";

export default function TaskCard({ task, isActive = false, onClick }) {
  const style = STATUS_STYLE[task.status] || STATUS_STYLE.todo;
  const icon = task.icon || style.defaultIcon;
  const hasDescription = Boolean(task.description?.trim());

  return (
    <article
      className={`${style.container} shadow-soft flex gap-4 rounded-2xl px-4 py-4 ${
        hasDescription ? "min-h-[118px] items-start" : "min-h-[74px] items-center"
      } ${
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
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf0f5] text-xl">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-title text-type-task-title leading-none font-semibold">
          {task.title}
        </h3>
        {hasDescription ? (
          <p className="text-text text-type-description mt-1 leading-[1.25] font-light">
            {task.description}
          </p>
        ) : null}
      </div>
      {style.badge ? (
        <span className={`${style.badgeBg} grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl text-white`}>
          {style.badge}
        </span>
      ) : null}
    </article>
  );
}
