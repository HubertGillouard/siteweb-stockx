import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Proxy API dev -> backend
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true
      },
      // Proxy images dev -> backend
      "/images": {
        target: "http://localhost:5050",
        changeOrigin: true
      }
    }
  },
  preview: { port: 4000 }
});
