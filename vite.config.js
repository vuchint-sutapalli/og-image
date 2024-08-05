import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1", // Change this to your desired host
    port: 5173, // Optionally set the port if needed
  },
});
