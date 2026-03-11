import { useEffect } from "react";
import { ICON_OPTIONS, STATUS_OPTIONS } from "../constants/taskUi";
import CloseRingDuotoneAltIcon from "./icons/CloseRingDuotoneAltIcon";
import TrashIcon from "./icons/TrashIcon";
import DoneRoundIcon from "./icons/DoneRoundIcon";

export default function TaskEditorModal({
  open,
  mode,
  draft,
  saving,
  onClose,
  onChange,
  onSave,
  onDelete
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const isNew = mode === "new";

  return (
    <div className="fixed inset-0 z-50 bg-black/25">
      <div className="absolute right-0 top-0 h-full w-full max-w-[640px] overflow-y-auto rounded-l-2xl bg-[#f8f9fb] p-6 shadow-xl sm:p-8">
        <div className="mb-5 flex items-start justify-between">
          <h2 className="text-title text-type-task-title font-semibold">Task details</h2>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#d5dbe7] bg-[#eef1f6] text-xl text-[#cf9837]"
            onClick={onClose}
            aria-label="Close editor"
          >
            <CloseRingDuotoneAltIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-type-input-label font-medium text-[#90a0b8]">Task name</span>
            <input
              type="text"
              value={draft.title}
              onChange={(event) => onChange("title", event.target.value)}
              placeholder="Task name"
              className="text-title text-type-task-title w-full rounded-xl border border-[#3562df] bg-transparent px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-[#3562df]/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-type-input-label font-medium text-[#90a0b8]">Description</span>
            <textarea
              value={draft.description}
              onChange={(event) => onChange("description", event.target.value)}
              placeholder="Enter a short description"
              rows={4}
              className="text-title text-type-description w-full resize-none rounded-xl border border-[#cfd6e2] bg-transparent px-4 py-3 font-light outline-none focus:border-[#3562df] focus:ring-2 focus:ring-[#3562df]/20"
            />
          </label>

          <section>
            <h3 className="mb-2 text-type-input-label font-medium text-[#90a0b8]">Icon</h3>
            <div className="flex flex-wrap gap-3">
              {ICON_OPTIONS.map((icon) => {
                const active = draft.icon === icon;
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => onChange("icon", icon)}
                    className={`grid h-12 w-12 place-items-center rounded-xl text-xl ${active
                      ? "bg-[#eecf57] ring-2 ring-[#e1be2f]"
                      : "bg-[#dbe0e8] text-[#2a3141] hover:bg-[#cfd6e2]"
                      }`}
                  >
                    {icon}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-type-input-label font-medium text-[#90a0b8]">Status</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STATUS_OPTIONS.map((status) => {
                const active = draft.status === status.value;
                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => onChange("status", status.value)}
                    className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-left ${active ? "border-[#3562df] bg-white" : "border-[#cfd6e2] bg-[#f8f9fb]"
                      }`}
                  >
                    <span className={`${status.badgeBg} grid h-11 w-11 place-items-center rounded-xl text-2xl text-white`}>
                      {status.badge || "•"}
                    </span>
                    <span className="text-title text-type-task-button font-semibold">
                      {status.label}
                    </span>
                    {active ? (
                      <span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-[#3562df] text-white">
                        ✓
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4">
          {!isNew ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={saving}
              className="text-type-button-text rounded-full bg-[#a8b3c5] px-8 py-3 font-medium text-white disabled:opacity-70"
            >
              Delete <TrashIcon className="h-5 w-5" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="text-type-button-text rounded-full bg-[#3562df] px-10 py-3 font-medium text-white disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save"}
            <DoneRoundIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
