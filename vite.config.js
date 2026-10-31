import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// SINGLE=1 npm run build  -> genera un único index.html autocontenido (para publicar la demo)
export default defineConfig({
  base: "./", // rutas relativas: funciona en GitHub Pages y en cualquier carpeta
  plugins: [react(), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
  test: { environment: "node" },
});
