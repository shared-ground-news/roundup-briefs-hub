import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Translations } from "@/lib/translations";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  t: Translations;
}

type ContactType = "question" | "feedback" | "add-newspaper";

const TYPE_OPTIONS: { value: ContactType; label: string }[] = [
  { value: "question",       label: "i have a question" },
  { value: "feedback",       label: "i have feedback" },
  { value: "add-newspaper",  label: "i want to suggest a newspaper" },
];

export default function ContactModal({ open, onClose, t }: ContactModalProps) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [type, setType]       = useState<ContactType>("question");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setTimeout(() => {
        setName(""); setEmail(""); setType("question");
        setMessage(""); setLoading(false); setSent(false); setError("");
      }, 200);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, message }),
      });
      if (!res.ok) throw new Error("server error");
      setSent(true);
    } catch {
      setError("something went wrong. please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">{t.contactUs}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            write to us. we read every message.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-2xl">✉️</p>
            <p className="text-sm font-medium">message sent.</p>
            <p className="text-sm text-muted-foreground">
              we'll get back to you as soon as we can.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-1">
            <Input
              placeholder="your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContactType)}
              className="text-sm px-3 py-1.5 rounded-sm border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <textarea
              placeholder="your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="text-sm px-3 py-2 rounded-sm border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "sending…" : "send message"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
