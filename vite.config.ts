import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/module-mastery-sim/", // 👈 must match your GitHub repo name
  plugins: [
    react(),
    ...(mode === "development" ? [componentTagger()] : []), // conditionally add dev plugin
  ],
  server: {
    host: "::", // allows access via localhost and LAN
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
