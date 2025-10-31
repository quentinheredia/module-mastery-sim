import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- Restore SPA redirect after GitHub Pages reload ---
const redirect = sessionStorage.redirect;
if (redirect) {
  sessionStorage.removeItem("redirect");
  window.history.replaceState(null, "", redirect);
}
// ------------------------------------------------------

createRoot(document.getElementById("root")!).render(<App />);
