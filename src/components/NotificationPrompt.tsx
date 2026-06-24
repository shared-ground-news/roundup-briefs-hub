import { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { Bell, X } from "lucide-react";

const STORAGE_KEY = "sg_notification_prompt_dismissed";

const NotificationPrompt = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or permission already decided
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default") return;

    // Show after 8 seconds
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const allow = async () => {
    dismiss();
    await OneSignal.Notifications.requestPermission();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[200] bg-background border border-border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300">
      <Bell className="h-5 w-5 mt-0.5 shrink-0 text-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-snug">
          Neue Artikel als Benachrichtigung?
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Bleib informiert, wenn es neue Artikel gibt.
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={allow}
            className="text-xs bg-foreground text-background px-3 py-1.5 rounded-sm font-medium hover:opacity-80 transition-opacity"
          >
            Ja, bitte
          </button>
          <button
            onClick={dismiss}
            className="text-xs text-muted-foreground px-3 py-1.5 hover:text-foreground transition-colors"
          >
            Nein danke
          </button>
        </div>
      </div>
      <button
        onClick={dismiss}
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        aria-label="Schließen"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default NotificationPrompt;
