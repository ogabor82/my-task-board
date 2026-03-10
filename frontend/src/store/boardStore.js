import { create } from "zustand";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const useBoardStore = create((set) => ({
  board: null,
  loading: false,
  error: null,
  fetchBoard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/boards/1`);
      if (!response.ok) {
        throw new Error(`Failed to fetch board: ${response.status}`);
      }

      const payload = await response.json();
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
  }
}));
