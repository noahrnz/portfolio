import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import App from "./app/App.tsx";
import "./styles/index.css";

const isEmbed =
  typeof window !== "undefined" && window.self !== window.top;

createRoot(document.getElementById("root")!).render(
  isEmbed ? (
    <MotionConfig reducedMotion="always" transition={{ duration: 0, delay: 0 }}>
      <App />
    </MotionConfig>
  ) : (
    <App />
  )
);
