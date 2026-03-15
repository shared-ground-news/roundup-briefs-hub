interface ContactBody {
  name: string;
  email: string;
  type: string;
  message: string;
}

export const onRequestPost: PagesFunction<{
  RESEND_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}> = async ({ request, env }) => {
  let body: ContactBody;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400 });
  }

  const { name, email, type, message } = body;

  if (!name || !email || !type || !message) {
    return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
  }

  // ── Send email via Resend ────────────────────────────────────────────────────
  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "shared ground <onboarding@resend.dev>",
      to: ["sharegroundnews@gmail.com"],
      subject: `[shared ground contact] ${type} from ${name}`,
      text: `name: ${name}\nemail: ${email}\ntype: ${type}\n\n${message}`,
    }),
  });

  if (!emailRes.ok) {
    const err = await emailRes.text();
    console.error("Resend error:", err);
    return new Response(JSON.stringify({ error: "email failed" }), { status: 500 });
  }

  // ── Insert into Supabase contact_submissions ─────────────────────────────────
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    await fetch(`${env.SUPABASE_URL}/rest/v1/contact_submissions`, {
      method: "POST",
      headers: {
        "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ name, email, type, message }),
    });
    // We don't fail the request if Supabase insert fails
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
