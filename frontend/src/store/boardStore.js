import { create } from "zustand";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const useBoardStore = create((set, get) => ({
  board: null,
  loading: false,
  saving: false,
  error: null,
  fetchBoard: async () => {
    set({ loading: true, error: null });
    try {
      const payload = await apiRequest("/api/boards");
      const board = Array.isArray(payload) ? payload[0] ?? null : payload;

      if (!board) {
        throw new Error("No board found in API response.");
      }

      set({ board, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown fetch error."
      });
    }
  },
  updateTask: async (taskId, updates) => {
    set({ saving: true, error: null });
    try {
      const updatedTask = await apiRequest(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(updates)
      });

      const { board } = get();
      if (!board) {
        throw new Error("Board not loaded.");
      }

      const tasks = board.tasks
        .map((task) => (task.id === taskId ? updatedTask : task))
        .sort((a, b) => a.position - b.position || a.id - b.id);

      set({ board: { ...board, tasks }, saving: false });
      return updatedTask;
    } catch (error) {
      set({
        saving: false,
        error: error instanceof Error ? error.message : "Unknown update error."
      });
      throw error;
    }
  },
  deleteTask: async (taskId) => {
    set({ saving: true, error: null });
    try {
      await apiRequest(`/api/tasks/${taskId}`, { method: "DELETE" });

      const { board } = get();
      if (!board) {
        throw new Error("Board not loaded.");
      }

      const tasks = board.tasks
        .filter((task) => task.id !== taskId)
        .map((task, index) => ({ ...task, position: index }));

      set({ board: { ...board, tasks }, saving: false });
    } catch (error) {
      set({
        saving: false,
        error: error instanceof Error ? error.message : "Unknown delete error."
      });
      throw error;
    }
  },
  createTask: async (taskDraft) => {
    set({ saving: true, error: null });
    try {
      const { board } = get();
      if (!board) {
        throw new Error("Board not loaded.");
      }

      const nextTasks = [...board.tasks, { ...taskDraft, position: board.tasks.length }];
      const updatedBoard = await apiRequest(`/api/boards/${board.id}`, {
        method: "PUT",
        body: JSON.stringify({
          tasks: nextTasks.map((task, index) => ({
            title: task.title,
            description: task.description ?? null,
            icon: task.icon ?? null,
            status: task.status ?? "todo",
            position: index
          }))
        })
      });

      set({ board: updatedBoard, saving: false });
      return updatedBoard;
    } catch (error) {
      set({
        saving: false,
        error: error instanceof Error ? error.message : "Unknown create error."
      });
      throw error;
    }
  }
}));
