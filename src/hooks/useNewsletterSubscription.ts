import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface SubscribeParams {
  email: string;
  topicSlugs?: string[];
  localePreference?: "en" | "de" | "both";
}

export function useNewsletterSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async ({ email }: SubscribeParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from("newsletter_waitlist")
        .insert({ email });

      if (err) {
        // Duplicate — already on the list, treat as success
        if (err.code === "23505") { setIsSuccess(true); return; }
        throw err;
      }
      setIsSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Etwas ist schiefgelaufen.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setError(null);
  };

  return { subscribe, isLoading, isSuccess, error, reset };
}
