/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        tinta: "#1E2340",
        morado: { DEFAULT: "#5B3FD0", oscuro: "#3E27A3", claro: "#EEE9FF" },
        coral: { DEFAULT: "#FF7A59", oscuro: "#D85A3A", claro: "#FFE8E1" },
        verde: { DEFAULT: "#1FA67A", oscuro: "#168060", claro: "#E3F6EE" },
        sol: { DEFAULT: "#FFD54A", oscuro: "#D9A900", claro: "#FFF4E0" },
        crema: "#FBF8F3",
        gris: "#6B6F86",
      },
      fontFamily: { titulo: ["Poppins", "sans-serif"], texto: ["Inter", "sans-serif"] },
    },
  },
  plugins: [],
};
