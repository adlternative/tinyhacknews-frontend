import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components/"),
      pages: path.resolve(__dirname, "src/pages/"),
      contexts: path.resolve(__dirname, "src/contexts/"),
      utils: path.resolve(__dirname, "src/utils/"),
      types: path.resolve(__dirname, "src/types/"),
      hooks: path.resolve(__dirname, "src/hooks/"),
      // 添加其他别名，如果需要
    },
  },
});
