import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const lead = await request.json();
    const { firstName, lastName, email, pms } = lead;

    if (!email || !pms) {
      return NextResponse.json({ error: "email and pms required" }, { status: 400 });
    }

    const payload = {
      source: "mcp_guide",
      firstName: firstName || "",
      lastName: lastName || "",
      email,
      pms,
      timestamp: new Date().toISOString(),
    };

    // Log lead (appears in Vercel function logs)
    console.log("NEW LEAD:", JSON.stringify(payload));

    // Forward to webhook if configured
    // Forward to Conduit workflow
    await fetch("https://api.conduit.ai/workflows?workflowId=w983hntxxmwzpdm1ktph8n7ed184e5h4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});

    // Also forward to optional secondary webhook
    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
