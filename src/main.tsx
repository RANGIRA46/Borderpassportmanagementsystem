
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./theme-obsidian.css";
  import "./theme-light.css";
  import "./theme-responsive.css";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  