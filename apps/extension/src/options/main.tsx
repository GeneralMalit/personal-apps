import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { OptionsApp } from "./OptionsApp";
import "./styles.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Missing options root element.");
}

createRoot(container).render(
  <StrictMode>
    <OptionsApp />
  </StrictMode>
);
