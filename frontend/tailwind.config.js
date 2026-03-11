/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#e6e7eb",
        card: "#f3d66f",
        cardDone: "#92d8a3",
        cardReject: "#e3c5c7",
        cardTodo: "#cfd3db",
        accent: "#eaab40",
        accentDone: "#28c64d",
        accentReject: "#de544a",
        addBg: "#ded3bf",
        title: "#101226",
        text: "#363746"
      },
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      fontSize: {
        "type-title": "2.5rem",
        "type-description": "1rem",
        "type-task-title": "1.25rem",
        "type-task-button": "1rem",
        "type-button-text": "0.875rem",
        "type-input-label": "0.75rem"
      },
      boxShadow: {
        soft: "0 4px 16px rgba(17, 24, 39, 0.05)"
      }
    }
  },
  plugins: []
};
