import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const lead = await request.json();
    const { firstName, lastName, email, pms, source } = lead;

    if (!email || !pms) {
      return NextResponse.json({ error: "email and pms required" }, { status: 400 });
    }

    // Log lead (appears in Vercel function logs)
    console.log("NEW LEAD:", JSON.stringify({ firstName, lastName, email, pms, source, timestamp: new Date().toISOString() }));

    // If a Google Sheets webhook is configured, forward the lead
    const sheetsWebhook = process.env.LEADS_WEBHOOK_URL;
    if (sheetsWebhook) {
      const blob = new Blob([JSON.stringify({ firstName, lastName, email, pms, source, timestamp: new Date().toISOString() })], { type: "text/plain" });
      await fetch(sheetsWebhook, {
        method: "POST",
        body: blob,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
