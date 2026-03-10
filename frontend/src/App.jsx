import { useEffect, useMemo, useState } from "react";
import TaskCard from "./components/TaskCard";
import TaskEditorModal from "./components/TaskEditorModal";
import { STATUS_STYLE } from "./constants/taskUi";
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

function makeDraft(task = null) {
  const status = task?.status || "todo";
  return {
    id: task?.id ?? null,
    title: task?.title ?? "",
    description: task?.description ?? "",
    icon: task?.icon ?? STATUS_STYLE[status]?.defaultIcon ?? "📚",
    status
  };
}

export default function App() {
  const { board, loading, saving, error, fetchBoard, updateTask, deleteTask, createTask } = useBoardStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [draft, setDraft] = useState(makeDraft());

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const activeTaskId = useMemo(() => (mode === "edit" ? draft.id : null), [draft.id, mode]);

  const openNewTask = () => {
    setMode("new");
    setDraft(makeDraft());
    setModalOpen(true);
  };

  const openEditTask = (task) => {
    setMode("edit");
    setDraft(makeDraft(task));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const onChangeDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const onSave = async () => {
    const title = draft.title.trim();
    if (!title) {
      return;
    }

    const payload = {
      title,
      description: draft.description.trim() || null,
      icon: draft.icon || null,
      status: draft.status
    };

    if (mode === "edit" && draft.id) {
      await updateTask(draft.id, payload);
    } else {
      await createTask(payload);
    }

    closeModal();
  };

  const onDelete = async () => {
    if (mode !== "edit" || !draft.id) {
      return;
    }

    await deleteTask(draft.id);
    closeModal();
  };

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
          <p className="rounded-2xl bg-red-100 px-4 py-3 text-[18px] text-red-700">{error}</p>
        ) : null}

        {!loading && !error && board?.tasks?.length ? (
          <div className="flex flex-col gap-4">
            {board.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isActive={activeTaskId === task.id && modalOpen}
                onClick={() => openEditTask(task)}
              />
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={openNewTask}
          className="bg-addBg shadow-soft mt-1 flex min-h-[96px] items-center gap-4 rounded-2xl px-4 py-4 sm:px-5"
        >
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-2xl text-white">
            +
          </span>
          <span className="text-title text-[34px] font-semibold tracking-[-0.02em]">Add new task</span>
        </button>
      </section>

      <TaskEditorModal
        open={modalOpen}
        mode={mode}
        draft={draft}
        saving={saving}
        onClose={closeModal}
        onChange={onChangeDraft}
        onSave={onSave}
        onDelete={onDelete}
      />
    </main>
  );
}
