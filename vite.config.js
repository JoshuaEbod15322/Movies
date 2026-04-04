import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL(".", import.meta.url)),
      },
    },
    build: {
      // minify: "esbuild",
      sourcemap: false,
      rollupOptions: {
        output: {
          // Changed from Object to Function to satisfy Vite 8 / Rolldown
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "vendor";
              }
              if (id.includes("lucide-react") || id.includes("motion/react")) {
                return "ui";
              }
              // Optional: Put all other dependencies into a generic vendor chunk
              // return "vendor";
            }
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== "true",
    },
  };
});
