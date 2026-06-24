import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import OneSignal from "react-onesignal";

OneSignal.init({
  appId: "cdbb5e39-5291-4e60-b922-a3f6cb02e4f5",
  allowLocalhostAsSecureOrigin: true,
  notifyButton: { enable: false },
  serviceWorkerParam: { scope: "/" },
});

createRoot(document.getElementById("root")!).render(<App />);
