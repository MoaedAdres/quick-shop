import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@/Utils/i18n.ts"; // Import the i18n configuration

createRoot(document.getElementById("root")!).render(<App />);
