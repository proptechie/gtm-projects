import { NextResponse } from "next/server";

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  li_fat_id?: string;
  ttclid?: string;
  irclickid?: string;
  landing_url?: string;
  landing_referrer?: string;
  landing_timestamp?: string;
  current_url?: string;
  referrer?: string;
};

export async function POST(request: Request) {
  try {
    const lead = await request.json();
    const { firstName, lastName, email, pms, attribution } = lead as {
      firstName?: string;
      lastName?: string;
      email?: string;
      pms?: string;
      attribution?: Attribution;
    };

    if (!email || !pms) {
      return NextResponse.json({ error: "email and pms required" }, { status: 400 });
    }

    const attr: Attribution = attribution ?? {};

    const payload = {
      source: "mcp_guide",
      firstName: firstName || "",
      lastName: lastName || "",
      email,
      pms,
      timestamp: new Date().toISOString(),
      utm_source: attr.utm_source || "",
      utm_medium: attr.utm_medium || "",
      utm_campaign: attr.utm_campaign || "",
      utm_content: attr.utm_content || "",
      utm_term: attr.utm_term || "",
      gclid: attr.gclid || "",
      fbclid: attr.fbclid || "",
      msclkid: attr.msclkid || "",
      li_fat_id: attr.li_fat_id || "",
      ttclid: attr.ttclid || "",
      irclickid: attr.irclickid || "",
      landing_url: attr.landing_url || "",
      landing_referrer: attr.landing_referrer || "",
      landing_timestamp: attr.landing_timestamp || "",
      current_url: attr.current_url || "",
      referrer: attr.referrer || "",
    };

    // Log lead (appears in Vercel function logs)
    console.log("NEW LEAD:", JSON.stringify(payload));

    // Forward to Conduit workflow
    const conduitWebhookUrl = process.env.CONDUIT_WEBHOOK_URL || "https://api.conduit.ai/workflows?workflowId=w983hntxxmwzpdm1ktph8n7ed184e5h4";
    await fetch(conduitWebhookUrl, {
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
