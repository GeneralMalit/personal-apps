import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { TrayRuntimeApp } from "./TrayRuntimeApp";
import "./styles.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Missing Tauri root element.");
}

createRoot(container).render(
  <StrictMode>
    <TrayRuntimeApp />
  </StrictMode>
);
