// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "");
  console.log(`当前模式: ${mode}`);
  console.log(`VITE_API_URL: ${env.VITE_API_URL}`);

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL, // 使用从环境变量加载的 VITE_API_URL
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
        styles: path.resolve(__dirname, "src/styles/"),
        // 添加其他别名（如有需要）
      },
    },
  };
});
