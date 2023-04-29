import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/products": "http://localhost:3000",
      "/api/products/slug/adidas-fit-pant": "http://localhost:3000",
    },
  },
  plugins: [react()],
});
