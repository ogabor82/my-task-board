import { useEffect } from "react";
import TaskCard from "./components/TaskCard";
import { useBoardStore } from "./store/boardStore";

function TitleIcon() {
  return (
    <span className="relative h-10 w-10 shrink-0">
      <span className="absolute left-0 top-3 h-6 w-8 -rotate-6 rounded-md bg-[#f6e8cf]" />
      <span className="absolute left-1 top-1 h-6 w-8 -rotate-6 rounded-md bg-[#f0c06d]" />
      <span className="absolute left-2 top-0 h-6 w-8 -rotate-6 rounded-md bg-[#e39d2f]" />
    </span>
  );
}

function EditPencil() {
  return <span className="text-[18px] text-[#141633]">✎</span>;
}

export default function App() {
  const { board, loading, error, fetchBoard } = useBoardStore();

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  return (
    <main className="min-h-full bg-page px-5 py-10 sm:px-10">
      <section className="mx-auto flex w-full max-w-[780px] flex-col gap-5">
        <header className="mb-2">
          <div className="flex items-center gap-3">
            <TitleIcon />
            <h1 className="text-title text-[52px]/[1.05] font-semibold tracking-[-0.03em] sm:text-[64px]/[1]">
              {board?.title || "My Task Board"}
            </h1>
            <EditPencil />
          </div>
          <p className="text-text mt-3 pl-[54px] text-[27px]/[1.2] font-normal">
            {board?.description || "Tasks to keep organised"}
          </p>
        </header>

        {loading ? (
          <p className="text-text rounded-2xl bg-white/40 px-4 py-3 text-[18px]">Loading board...</p>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-red-100 px-4 py-3 text-[18px] text-red-700">
            {error}
          </p>
        ) : null}

        {!loading && !error && board?.tasks?.length ? (
          <div className="flex flex-col gap-4">
            {board.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : null}

        <button
          type="button"
          className="bg-addBg shadow-soft mt-1 flex min-h-[96px] items-center gap-4 rounded-2xl px-4 py-4 sm:px-5"
        >
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-2xl text-white">
            +
          </span>
          <span className="text-title text-[34px] font-semibold tracking-[-0.02em]">Add new task</span>
        </button>
      </section>
    </main>
  );
}
