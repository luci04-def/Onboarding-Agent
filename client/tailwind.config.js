
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark dashboard palette inspired by provided screenshots
        bg: "#0E1217",
        panel: "#151A21",
        panel2: "#1B222B",
        ink: "#E6EAF2",
        mute: "#9BA7B4",
        primary: "#3A7BFF",    // blue
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444"
      },
      borderRadius: { xxl: "1.25rem" },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
      }
    },
  },
  plugins: [],
}
