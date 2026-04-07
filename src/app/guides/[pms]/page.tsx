"use client";

import { useParams } from "next/navigation";
import { ArrowRight, Calendar, Terminal, Copy, Check, ExternalLink, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// ─── PMS Guide Data ──────────────────────────────────────────────────────────

interface GuideData {
  name: string;
  color: string;
  logo: string;
  apiDocsUrl: string;
  authMethod: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  getCredentials: string[];
  envVars: { key: string; desc: string }[];
  mcpServerCode: string;
  claudeConfig: string;
  keyEndpoints: { method: string; path: string; desc: string }[];
  tips: string[];
  claudePrompt: string;
}

const GUIDES: Record<string, GuideData> = {
  guesty: {
    name: "Guesty",
    color: "#0066FF",
    logo: "G",
    apiDocsUrl: "https://open-api.guesty.com",
    authMethod: "OAuth2 Client Credentials",
    difficulty: "Easy",
    description: "Guesty is one of the most popular short-term rental management platforms. Their Open API is well-documented and uses OAuth2 for authentication.",
    getCredentials: [
      "Log in to your Guesty dashboard",
      "Go to Marketplace > Development Tools > Open API",
      "Create a new API client (Client ID + Client Secret)",
      "Note your Client ID and Client Secret",
    ],
    envVars: [
      { key: "GUESTY_CLIENT_ID", desc: "Your Guesty API client ID" },
      { key: "GUESTY_CLIENT_SECRET", desc: "Your Guesty API client secret" },
    ],
    mcpServerCode: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "guesty-mcp", version: "1.0.0" });

// Token cache
let token: string | null = null;
let tokenExpiry = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;
  const res = await fetch("https://open-api.guesty.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.GUESTY_CLIENT_ID!,
      client_secret: process.env.GUESTY_CLIENT_SECRET!,
    }),
  });
  const data = await res.json();
  token = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return token;
}

async function guestyFetch(path: string, options?: RequestInit) {
  const t = await getToken();
  const res = await fetch(\`https://open-api.guesty.com/v1\${path}\`, {
    ...options,
    headers: { Authorization: \`Bearer \${t}\`, "Content-Type": "application/json", ...options?.headers },
  });
  return res.json();
}

server.tool("list-reservations", "List recent reservations", {
  limit: z.number().optional().describe("Max results (default 25)"),
  status: z.string().optional().describe("Filter by status: confirmed, checked_in, checked_out, canceled"),
}, async ({ limit = 25, status }) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (status) params.set("filters[status]", status);
  const data = await guestyFetch(\`/reservations?\${params}\`);
  return { content: [{ type: "text", text: JSON.stringify(data.results?.slice(0, limit), null, 2) }] };
});

server.tool("get-reservation", "Get reservation details", {
  id: z.string().describe("Reservation ID"),
}, async ({ id }) => {
  const data = await guestyFetch(\`/reservations/\${id}\`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("list-listings", "List all property listings", {
  limit: z.number().optional(),
}, async ({ limit = 50 }) => {
  const data = await guestyFetch(\`/listings?limit=\${limit}\`);
  return { content: [{ type: "text", text: JSON.stringify(data.results, null, 2) }] };
});

server.tool("send-guest-message", "Send a message to a guest", {
  reservationId: z.string().describe("Reservation ID"),
  message: z.string().describe("Message text to send"),
}, async ({ reservationId, message }) => {
  const data = await guestyFetch(\`/communication/conversations/\${reservationId}/messages\`, {
    method: "POST",
    body: JSON.stringify({ body: message }),
  });
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error("Guesty MCP server running on stdio");`,
    claudeConfig: `{
  "mcpServers": {
    "guesty": {
      "command": "node",
      "args": ["path/to/guesty-mcp/index.js"],
      "env": {
        "GUESTY_CLIENT_ID": "your-client-id",
        "GUESTY_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}`,
    keyEndpoints: [
      { method: "GET", path: "/v1/reservations", desc: "List & search reservations" },
      { method: "GET", path: "/v1/listings", desc: "List all properties" },
      { method: "GET", path: "/v1/guests", desc: "List & search guests" },
      { method: "POST", path: "/v1/reservations", desc: "Create a reservation" },
      { method: "GET", path: "/v1/tasks", desc: "List housekeeping tasks" },
      { method: "POST", path: "/v1/communication/.../messages", desc: "Send guest messages" },
    ],
    tips: [
      "Guesty's API rate limits are generous — 100 requests/minute for most endpoints",
      "Use the /reservations endpoint with date filters to pull upcoming check-ins",
      "Guest messaging requires the conversation ID, which you get from the reservation",
      "The /tasks endpoint is great for housekeeping automation with Claude",
    ],
    claudePrompt: "I manage vacation rentals using Guesty as my PMS. What are the biggest ways AI and a tool like Conduit can help me automate guest communications, manage pricing, coordinate housekeeping, and improve my guest experience? I'm looking for specific use cases that would save me time every day.",
  },

  mews: {
    name: "Mews",
    color: "#00C2A8",
    logo: "M",
    apiDocsUrl: "https://mews-systems.gitbook.io/connector-api",
    authMethod: "API Key (ClientToken + AccessToken)",
    difficulty: "Easy",
    description: "Mews is a cloud-native hospitality platform. Their Connector API is well-documented with straightforward token-based auth.",
    getCredentials: [
      "Log in to Mews Commander",
      "Go to Settings > Integrations",
      "Create a new integration or use an existing one",
      "Copy your ClientToken and AccessToken",
      "Note the API URL for your environment (demo or production)",
    ],
    envVars: [
      { key: "MEWS_CLIENT_TOKEN", desc: "Your Mews client token" },
      { key: "MEWS_ACCESS_TOKEN", desc: "Your Mews access token" },
      { key: "MEWS_API_URL", desc: "https://api.mews.com (production) or https://api.mews-demo.com (demo)" },
    ],
    mcpServerCode: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "mews-mcp", version: "1.0.0" });

const API_URL = process.env.MEWS_API_URL || "https://api.mews.com";

async function mewsPost(endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(\`\${API_URL}/api/connector/v1/\${endpoint}\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ClientToken: process.env.MEWS_CLIENT_TOKEN,
      AccessToken: process.env.MEWS_ACCESS_TOKEN,
      ...body,
    }),
  });
  return res.json();
}

server.tool("get-reservations", "Get reservations for a date range", {
  startUtc: z.string().describe("Start date (ISO 8601)"),
  endUtc: z.string().describe("End date (ISO 8601)"),
}, async ({ startUtc, endUtc }) => {
  const data = await mewsPost("reservations/getAll", {
    StartUtc: startUtc,
    EndUtc: endUtc,
    Limitation: { Count: 100 },
  });
  return { content: [{ type: "text", text: JSON.stringify(data.Reservations?.slice(0, 50), null, 2) }] };
});

server.tool("get-customers", "Search for customers/guests", {
  name: z.string().optional().describe("Name to search for"),
  email: z.string().optional().describe("Email to search for"),
}, async ({ name, email }) => {
  const data = await mewsPost("customers/getAll", {
    ...(name && { FirstName: name }),
    ...(email && { Emails: [email] }),
    Limitation: { Count: 50 },
  });
  return { content: [{ type: "text", text: JSON.stringify(data.Customers?.slice(0, 25), null, 2) }] };
});

server.tool("get-spaces", "List all rooms/spaces", {}, async () => {
  const data = await mewsPost("spaces/getAll", {});
  return { content: [{ type: "text", text: JSON.stringify(data.Spaces, null, 2) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error("Mews MCP server running on stdio");`,
    claudeConfig: `{
  "mcpServers": {
    "mews": {
      "command": "node",
      "args": ["path/to/mews-mcp/index.js"],
      "env": {
        "MEWS_CLIENT_TOKEN": "your-client-token",
        "MEWS_ACCESS_TOKEN": "your-access-token",
        "MEWS_API_URL": "https://api.mews.com"
      }
    }
  }
}`,
    keyEndpoints: [
      { method: "POST", path: "reservations/getAll", desc: "List reservations by date range" },
      { method: "POST", path: "customers/getAll", desc: "Search guests/customers" },
      { method: "POST", path: "spaces/getAll", desc: "List rooms and spaces" },
      { method: "POST", path: "services/getAll", desc: "List available services" },
      { method: "POST", path: "orders/getAll", desc: "List orders and charges" },
    ],
    tips: [
      "Mews uses POST for all API calls, even reads — don't expect GET endpoints",
      "All requests require both ClientToken and AccessToken in the body",
      "Date ranges are required for most queries — use ISO 8601 format",
      "The demo environment at api.mews-demo.com is great for testing",
    ],
    claudePrompt: "I run a hotel using Mews as my PMS. How can AI tools like Conduit help me automate front desk operations, manage room assignments, handle guest requests, and improve our service quality? What specific workflows would save my team the most time?",
  },

  hostaway: {
    name: "Hostaway",
    color: "#FF6B35",
    logo: "H",
    apiDocsUrl: "https://api.hostaway.com/documentation",
    authMethod: "OAuth2 Client Credentials",
    difficulty: "Easy",
    description: "Hostaway is a popular vacation rental software with a comprehensive API. OAuth2 authentication with well-documented endpoints.",
    getCredentials: [
      "Log in to your Hostaway dashboard",
      "Navigate to Settings > API",
      "Create API credentials (Client ID + Secret)",
      "Note your Account ID from the dashboard URL",
    ],
    envVars: [
      { key: "HOSTAWAY_CLIENT_ID", desc: "Your Hostaway API client ID" },
      { key: "HOSTAWAY_CLIENT_SECRET", desc: "Your Hostaway API client secret" },
      { key: "HOSTAWAY_ACCOUNT_ID", desc: "Your Hostaway account ID" },
    ],
    mcpServerCode: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "hostaway-mcp", version: "1.0.0" });

let token: string | null = null;
let tokenExpiry = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;
  const res = await fetch("https://api.hostaway.com/v1/accessTokens", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.HOSTAWAY_CLIENT_ID!,
      client_secret: process.env.HOSTAWAY_CLIENT_SECRET!,
      scope: "general",
    }),
  });
  const data = await res.json();
  token = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return token;
}

async function hostawayFetch(path: string) {
  const t = await getToken();
  const res = await fetch(\`https://api.hostaway.com/v1\${path}\`, {
    headers: { Authorization: \`Bearer \${t}\` },
  });
  return res.json();
}

server.tool("list-reservations", "List reservations", {
  limit: z.number().optional(),
}, async ({ limit = 25 }) => {
  const data = await hostawayFetch(\`/reservations?limit=\${limit}\`);
  return { content: [{ type: "text", text: JSON.stringify(data.result?.slice(0, limit), null, 2) }] };
});

server.tool("list-listings", "List all listings/properties", {}, async () => {
  const data = await hostawayFetch("/listings");
  return { content: [{ type: "text", text: JSON.stringify(data.result, null, 2) }] };
});

server.tool("get-conversations", "List guest conversations", {
  listingId: z.number().optional(),
}, async ({ listingId }) => {
  const path = listingId ? \`/conversations?listingId=\${listingId}\` : "/conversations";
  const data = await hostawayFetch(path);
  return { content: [{ type: "text", text: JSON.stringify(data.result?.slice(0, 20), null, 2) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error("Hostaway MCP server running on stdio");`,
    claudeConfig: `{
  "mcpServers": {
    "hostaway": {
      "command": "node",
      "args": ["path/to/hostaway-mcp/index.js"],
      "env": {
        "HOSTAWAY_CLIENT_ID": "your-client-id",
        "HOSTAWAY_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}`,
    keyEndpoints: [
      { method: "GET", path: "/v1/reservations", desc: "List reservations" },
      { method: "GET", path: "/v1/listings", desc: "List properties" },
      { method: "GET", path: "/v1/conversations", desc: "Guest messaging" },
      { method: "GET", path: "/v1/calendar", desc: "Availability calendar" },
      { method: "GET", path: "/v1/financials", desc: "Financial reports" },
    ],
    tips: [
      "Hostaway's API is RESTful and intuitive — most endpoints are simple GETs",
      "Rate limit is 20 requests per second — generous for most use cases",
      "Use the /calendar endpoint for real-time availability checks",
      "Conversations API lets Claude handle guest messaging end-to-end",
    ],
    claudePrompt: "I use Hostaway to manage my vacation rental properties. What are the best ways AI can help me automate guest messaging, optimize pricing, coordinate cleaning teams, and handle booking inquiries? I want specific examples of how Conduit would help.",
  },

  track: {
    name: "Track",
    color: "#1B3A5C",
    logo: "T",
    apiDocsUrl: "https://developer.trackhs.com",
    authMethod: "API Key",
    difficulty: "Medium",
    description: "Track (TrackHS) is a hospitality PMS focused on hotels and resorts. Their API requires a partner or enterprise agreement for full access.",
    getCredentials: [
      "Contact Track support or your account manager to request API access",
      "You may need to sign a developer agreement",
      "Once approved, you'll receive an API key and endpoint URL",
      "Test in the sandbox environment first",
    ],
    envVars: [
      { key: "TRACK_API_KEY", desc: "Your Track API key" },
      { key: "TRACK_API_URL", desc: "Your Track API base URL" },
    ],
    mcpServerCode: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "track-mcp", version: "1.0.0" });

const API_URL = process.env.TRACK_API_URL!;
const API_KEY = process.env.TRACK_API_KEY!;

async function trackFetch(path: string) {
  const res = await fetch(\`\${API_URL}\${path}\`, {
    headers: { "Authorization": \`Bearer \${API_KEY}\`, "Content-Type": "application/json" },
  });
  return res.json();
}

server.tool("list-reservations", "List reservations", {
  checkInDate: z.string().optional().describe("Check-in date filter (YYYY-MM-DD)"),
}, async ({ checkInDate }) => {
  const params = checkInDate ? \`?checkInDate=\${checkInDate}\` : "";
  const data = await trackFetch(\`/reservations\${params}\`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("list-rooms", "List all rooms and their status", {}, async () => {
  const data = await trackFetch("/rooms");
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get-guest", "Get guest details", {
  guestId: z.string().describe("Guest ID"),
}, async ({ guestId }) => {
  const data = await trackFetch(\`/guests/\${guestId}\`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error("Track MCP server running on stdio");`,
    claudeConfig: `{
  "mcpServers": {
    "track": {
      "command": "node",
      "args": ["path/to/track-mcp/index.js"],
      "env": {
        "TRACK_API_KEY": "your-api-key",
        "TRACK_API_URL": "https://api.trackhs.com"
      }
    }
  }
}`,
    keyEndpoints: [
      { method: "GET", path: "/reservations", desc: "List reservations" },
      { method: "GET", path: "/rooms", desc: "Room inventory and status" },
      { method: "GET", path: "/guests", desc: "Guest profiles" },
      { method: "GET", path: "/housekeeping", desc: "Housekeeping tasks" },
    ],
    tips: [
      "API access may require a partner agreement — reach out to your Track rep",
      "Start with the sandbox environment for testing",
      "The housekeeping endpoint is particularly useful for AI-driven task assignment",
    ],
    claudePrompt: "I run a hotel using Track PMS. How can AI help me improve front desk operations, automate housekeeping assignments, manage guest communications, and increase operational efficiency? What does Conduit specifically offer for Track users?",
  },

  cloudbeds: {
    name: "Cloudbeds",
    color: "#00A4E4",
    logo: "C",
    apiDocsUrl: "https://hotels.cloudbeds.com/api/docs",
    authMethod: "OAuth2",
    difficulty: "Medium",
    description: "Cloudbeds is a comprehensive hotel management suite. Their API uses OAuth2 and requires applying for a developer account.",
    getCredentials: [
      "Go to hotels.cloudbeds.com/api/docs and apply for API access",
      "Create a developer application in the Cloudbeds Marketplace",
      "You'll get a Client ID and Client Secret",
      "Implement the OAuth2 authorization code flow to get tokens",
    ],
    envVars: [
      { key: "CLOUDBEDS_CLIENT_ID", desc: "Your Cloudbeds OAuth client ID" },
      { key: "CLOUDBEDS_CLIENT_SECRET", desc: "Your Cloudbeds OAuth client secret" },
      { key: "CLOUDBEDS_REFRESH_TOKEN", desc: "Your OAuth refresh token (obtained after authorization)" },
    ],
    mcpServerCode: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "cloudbeds-mcp", version: "1.0.0" });

let accessToken: string | null = null;
let tokenExpiry = 0;

async function refreshToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;
  const res = await fetch("https://hotels.cloudbeds.com/api/v1.2/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.CLOUDBEDS_CLIENT_ID!,
      client_secret: process.env.CLOUDBEDS_CLIENT_SECRET!,
      refresh_token: process.env.CLOUDBEDS_REFRESH_TOKEN!,
    }),
  });
  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
}

async function cloudbedsGet(endpoint: string) {
  const token = await refreshToken();
  const res = await fetch(\`https://hotels.cloudbeds.com/api/v1.2/\${endpoint}\`, {
    headers: { Authorization: \`Bearer \${token}\` },
  });
  return res.json();
}

server.tool("get-reservations", "Get reservations", {
  status: z.string().optional().describe("Status filter: confirmed, checked_in, checked_out, canceled"),
}, async ({ status }) => {
  const params = status ? \`?status=\${status}\` : "";
  const data = await cloudbedsGet(\`getReservations\${params}\`);
  return { content: [{ type: "text", text: JSON.stringify(data.data?.slice(0, 25), null, 2) }] };
});

server.tool("get-rooms", "Get all rooms", {}, async () => {
  const data = await cloudbedsGet("getRooms");
  return { content: [{ type: "text", text: JSON.stringify(data.data, null, 2) }] };
});

server.tool("get-hotel-details", "Get hotel details", {}, async () => {
  const data = await cloudbedsGet("getHotelDetails");
  return { content: [{ type: "text", text: JSON.stringify(data.data, null, 2) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error("Cloudbeds MCP server running on stdio");`,
    claudeConfig: `{
  "mcpServers": {
    "cloudbeds": {
      "command": "node",
      "args": ["path/to/cloudbeds-mcp/index.js"],
      "env": {
        "CLOUDBEDS_CLIENT_ID": "your-client-id",
        "CLOUDBEDS_CLIENT_SECRET": "your-client-secret",
        "CLOUDBEDS_REFRESH_TOKEN": "your-refresh-token"
      }
    }
  }
}`,
    keyEndpoints: [
      { method: "GET", path: "getReservations", desc: "List reservations" },
      { method: "GET", path: "getRooms", desc: "Room list and availability" },
      { method: "GET", path: "getGuests", desc: "Guest profiles" },
      { method: "GET", path: "getHousekeeping", desc: "Housekeeping status" },
      { method: "GET", path: "getHotelDetails", desc: "Property information" },
    ],
    tips: [
      "Cloudbeds uses OAuth2 auth code flow — you need to authorize via browser first to get a refresh token",
      "The refresh token can be long-lived, so you only do the browser auth once",
      "Rate limits are moderate — cache responses where possible",
      "The getHousekeeping endpoint pairs perfectly with Claude for task management",
    ],
    claudePrompt: "I use Cloudbeds to manage my hotel. How can AI help me automate daily operations — front desk, housekeeping, guest communications, and revenue management? What specific benefits would Conduit bring to a Cloudbeds hotel?",
  },

  apaleo: {
    name: "Apaleo",
    color: "#6C63FF",
    logo: "A",
    apiDocsUrl: "https://api.apaleo.com",
    authMethod: "OAuth2",
    difficulty: "Easy",
    description: "Apaleo is a cloud-native, API-first PMS. Their APIs are exceptionally well-documented with an OpenAPI spec. One of the best developer experiences in hospitality.",
    getCredentials: [
      "Go to apaleo.dev and create a developer account",
      "Register a new application in the developer portal",
      "You'll get a Client ID and Client Secret",
      "Use the OAuth2 auth code flow to authorize",
      "Apaleo also offers a sandbox environment for testing",
    ],
    envVars: [
      { key: "APALEO_CLIENT_ID", desc: "Your Apaleo OAuth client ID" },
      { key: "APALEO_CLIENT_SECRET", desc: "Your Apaleo OAuth client secret" },
      { key: "APALEO_REFRESH_TOKEN", desc: "Your OAuth refresh token" },
    ],
    mcpServerCode: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "apaleo-mcp", version: "1.0.0" });

let accessToken: string | null = null;
let tokenExpiry = 0;

async function getToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;
  const res = await fetch("https://identity.apaleo.com/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.APALEO_CLIENT_ID!,
      client_secret: process.env.APALEO_CLIENT_SECRET!,
      refresh_token: process.env.APALEO_REFRESH_TOKEN!,
    }),
  });
  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
}

async function apaleoGet(path: string) {
  const token = await getToken();
  const res = await fetch(\`https://api.apaleo.com\${path}\`, {
    headers: { Authorization: \`Bearer \${token}\` },
  });
  return res.json();
}

server.tool("list-reservations", "List reservations", {
  status: z.string().optional().describe("Filter: Confirmed, InHouse, CheckedOut, Canceled, NoShow"),
  from: z.string().optional().describe("From date (YYYY-MM-DD)"),
  to: z.string().optional().describe("To date (YYYY-MM-DD)"),
}, async ({ status, from, to }) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (from) params.set("dateFilter.from", from);
  if (to) params.set("dateFilter.to", to);
  const data = await apaleoGet(\`/booking/v1/reservations?\${params}\`);
  return { content: [{ type: "text", text: JSON.stringify(data.reservations?.slice(0, 25), null, 2) }] };
});

server.tool("list-properties", "List all properties", {}, async () => {
  const data = await apaleoGet("/inventory/v1/properties");
  return { content: [{ type: "text", text: JSON.stringify(data.properties, null, 2) }] };
});

server.tool("list-units", "List rooms/units", {
  propertyId: z.string().describe("Property ID"),
}, async ({ propertyId }) => {
  const data = await apaleoGet(\`/inventory/v1/units?propertyId=\${propertyId}\`);
  return { content: [{ type: "text", text: JSON.stringify(data.units, null, 2) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error("Apaleo MCP server running on stdio");`,
    claudeConfig: `{
  "mcpServers": {
    "apaleo": {
      "command": "node",
      "args": ["path/to/apaleo-mcp/index.js"],
      "env": {
        "APALEO_CLIENT_ID": "your-client-id",
        "APALEO_CLIENT_SECRET": "your-client-secret",
        "APALEO_REFRESH_TOKEN": "your-refresh-token"
      }
    }
  }
}`,
    keyEndpoints: [
      { method: "GET", path: "/booking/v1/reservations", desc: "List reservations" },
      { method: "GET", path: "/booking/v1/bookings", desc: "List bookings" },
      { method: "GET", path: "/inventory/v1/properties", desc: "List properties" },
      { method: "GET", path: "/inventory/v1/units", desc: "List rooms/units" },
      { method: "GET", path: "/finance/v1/folios", desc: "Guest folios/billing" },
    ],
    tips: [
      "Apaleo has the best developer experience in hospitality — full OpenAPI spec, sandbox, great docs",
      "Their API is truly RESTful with consistent patterns across all endpoints",
      "Use the sandbox at api.apaleo.com with test credentials",
      "The OpenAPI spec means you can auto-generate clients — consider using openapi-fetch",
    ],
    claudePrompt: "I use Apaleo as my cloud PMS. As a modern, API-first hotel operator, how can AI and Conduit help me build innovative guest experiences, automate operations, and leverage my data for better decision-making? What makes Conduit especially powerful with an open PMS like Apaleo?",
  },

  opera: {
    name: "Oracle Opera Cloud",
    color: "#C74634",
    logo: "O",
    apiDocsUrl: "https://docs.oracle.com/en/industries/hospitality/integration-platform/",
    authMethod: "OAuth2 (OHIP)",
    difficulty: "Hard",
    description: "Oracle Opera Cloud uses the Oracle Hospitality Integration Platform (OHIP). API access requires an Oracle partnership or enterprise agreement. The most complex setup, but it's the industry standard for large hotel chains.",
    getCredentials: [
      "You need an Oracle Hospitality partnership or enterprise agreement",
      "Register as an OHIP developer at Oracle's partner portal",
      "Request API credentials for your Opera Cloud environment",
      "You'll receive a Client ID, Client Secret, and environment-specific URLs",
      "Note: this process can take weeks — plan ahead",
    ],
    envVars: [
      { key: "OHIP_CLIENT_ID", desc: "Your OHIP OAuth client ID" },
      { key: "OHIP_CLIENT_SECRET", desc: "Your OHIP OAuth client secret" },
      { key: "OHIP_HOSTNAME", desc: "Your OHIP environment hostname" },
      { key: "OHIP_HOTEL_ID", desc: "Your Opera hotel/property ID" },
    ],
    mcpServerCode: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "opera-mcp", version: "1.0.0" });

const HOSTNAME = process.env.OHIP_HOSTNAME!;
const HOTEL_ID = process.env.OHIP_HOTEL_ID!;
let token: string | null = null;
let tokenExpiry = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;
  const res = await fetch(\`https://\${HOSTNAME}/oauth/v1/tokens\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-app-key": process.env.OHIP_CLIENT_ID!,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.OHIP_CLIENT_ID!,
      client_secret: process.env.OHIP_CLIENT_SECRET!,
    }),
  });
  const data = await res.json();
  token = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return token;
}

async function ohipGet(path: string) {
  const t = await getToken();
  const res = await fetch(\`https://\${HOSTNAME}\${path}\`, {
    headers: {
      Authorization: \`Bearer \${t}\`,
      "x-hotelid": HOTEL_ID,
      "x-app-key": process.env.OHIP_CLIENT_ID!,
    },
  });
  return res.json();
}

server.tool("get-reservations", "Get reservations", {
  arrivalDate: z.string().optional().describe("Arrival date (YYYY-MM-DD)"),
}, async ({ arrivalDate }) => {
  const params = arrivalDate ? \`?arrivalDate=\${arrivalDate}\` : "";
  const data = await ohipGet(\`/rsv/v1/hotels/\${HOTEL_ID}/reservations\${params}\`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("get-guest-profile", "Get guest profile", {
  profileId: z.string().describe("Guest profile ID"),
}, async ({ profileId }) => {
  const data = await ohipGet(\`/crm/v1/hotels/\${HOTEL_ID}/profiles/\${profileId}\`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error("Opera Cloud MCP server running on stdio");`,
    claudeConfig: `{
  "mcpServers": {
    "opera": {
      "command": "node",
      "args": ["path/to/opera-mcp/index.js"],
      "env": {
        "OHIP_CLIENT_ID": "your-client-id",
        "OHIP_CLIENT_SECRET": "your-client-secret",
        "OHIP_HOSTNAME": "your-environment.ohip.oracle.com",
        "OHIP_HOTEL_ID": "your-hotel-id"
      }
    }
  }
}`,
    keyEndpoints: [
      { method: "GET", path: "/rsv/v1/.../reservations", desc: "Reservation management" },
      { method: "GET", path: "/crm/v1/.../profiles", desc: "Guest profiles" },
      { method: "GET", path: "/fof/v1/.../cashiers", desc: "Front office/cashier" },
      { method: "GET", path: "/hsk/v1/.../rooms", desc: "Housekeeping" },
    ],
    tips: [
      "Opera Cloud API access requires an Oracle partnership — start that process early",
      "The OHIP API uses x-hotelid and x-app-key headers on every request",
      "API structure follows Oracle's REST conventions which differ from other PMS APIs",
      "Consider using Oracle's OHIP Playground for initial testing",
      "Rate limits are strict — implement proper caching and error handling",
    ],
    claudePrompt: "I operate a hotel chain running Oracle Opera Cloud. How can enterprise AI tools like Conduit help us standardize operations across properties, automate guest communications at scale, and integrate AI into our existing Oracle ecosystem? What ROI should we expect?",
  },

  muse: {
    name: "Muse",
    color: "#8B5CF6",
    logo: "M",
    apiDocsUrl: "https://docs.muse.tech",
    authMethod: "API Key",
    difficulty: "Medium",
    description: "Muse is a next-generation PMS platform. Their API is modern and developer-friendly. Access may require contacting their team directly.",
    getCredentials: [
      "Contact the Muse team to request API access",
      "You may need to be on a qualifying plan",
      "Once approved, generate an API key from your dashboard",
      "Review their API documentation for available endpoints",
    ],
    envVars: [
      { key: "MUSE_API_KEY", desc: "Your Muse API key" },
      { key: "MUSE_PROPERTY_ID", desc: "Your Muse property ID" },
    ],
    mcpServerCode: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "muse-mcp", version: "1.0.0" });

const API_KEY = process.env.MUSE_API_KEY!;
const PROPERTY_ID = process.env.MUSE_PROPERTY_ID!;

async function museFetch(path: string) {
  const res = await fetch(\`https://api.muse.tech/v1\${path}\`, {
    headers: {
      "Authorization": \`Bearer \${API_KEY}\`,
      "X-Property-Id": PROPERTY_ID,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

server.tool("list-reservations", "List reservations", {
  status: z.string().optional().describe("Filter by status"),
}, async ({ status }) => {
  const params = status ? \`?status=\${status}\` : "";
  const data = await museFetch(\`/reservations\${params}\`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("list-rooms", "List rooms", {}, async () => {
  const data = await museFetch("/rooms");
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool("list-guests", "List guests", {}, async () => {
  const data = await museFetch("/guests");
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);
console.error("Muse MCP server running on stdio");`,
    claudeConfig: `{
  "mcpServers": {
    "muse": {
      "command": "node",
      "args": ["path/to/muse-mcp/index.js"],
      "env": {
        "MUSE_API_KEY": "your-api-key",
        "MUSE_PROPERTY_ID": "your-property-id"
      }
    }
  }
}`,
    keyEndpoints: [
      { method: "GET", path: "/reservations", desc: "Reservation management" },
      { method: "GET", path: "/rooms", desc: "Room inventory" },
      { method: "GET", path: "/guests", desc: "Guest profiles" },
      { method: "GET", path: "/tasks", desc: "Task management" },
    ],
    tips: [
      "Muse is newer — their API may be evolving, so check for updates regularly",
      "Contact their team directly for the latest API documentation",
      "Their modern architecture means the API is typically fast and well-structured",
    ],
    claudePrompt: "I'm evaluating Muse as a modern PMS. How can AI-powered tools like Conduit enhance what Muse already offers? What specific workflows can I automate, and how does the integration between a next-gen PMS and AI create a competitive advantage for my hotel?",
  },
};

// ─── Copy Button ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-[var(--ct-neutral-700)] hover:bg-[var(--ct-neutral-600)] transition"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--ct-neutral-300)]" />}
    </button>
  );
}

// ─── Code Block ──────────────────────────────────────────────────────────────

function CodeBlock({ code, language = "javascript" }: { code: string; language?: string }) {
  return (
    <div className="relative rounded-lg bg-[var(--ct-neutral-900)] text-[var(--ct-neutral-200)] text-xs overflow-x-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--ct-neutral-800)]">
        <span className="text-[10px] text-[var(--ct-neutral-500)] font-mono">{language}</span>
      </div>
      <CopyButton text={code} />
      <pre className="p-4 overflow-x-auto"><code className="font-mono">{code}</code></pre>
    </div>
  );
}

// ─── Collapsible Section ─────────────────────────────────────────────────────

function Collapsible({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--ct-neutral-200)] rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-[var(--ct-neutral-100)] hover:bg-[var(--ct-neutral-200)] transition text-left">
        <span className="font-medium text-sm text-[var(--ct-neutral-900)]">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[var(--ct-neutral-500)]" /> : <ChevronDown className="w-4 h-4 text-[var(--ct-neutral-500)]" />}
      </button>
      {open && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

// ─── Guide Page ──────────────────────────────────────────────────────────────

export default function GuidePage() {
  const params = useParams();
  const pmsSlug = params.pms as string;
  const guide = GUIDES[pmsSlug];

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--ct-neutral-500)]">Guide not found. <a href="/" className="text-[var(--ct-blue-700)] underline">Back to all guides</a></p>
      </div>
    );
  }

  const calendarUrl = `https://scheduler.default.com/6434/member/63847a9b-4d1b-4b3a-b79a-390ab20d4e9e?utm_source=pms-guide&utm_medium=hero-cta&utm_campaign=pms-claude-guide&utm_content=${pmsSlug}`;
  const claudePromptUrl = `https://claude.ai/new?q=${encodeURIComponent(guide.claudePrompt)}`;

  return (
    <div className="min-h-screen bg-[var(--bg-page-body)]">
      {/* Nav */}
      <nav className="border-b border-[var(--ct-neutral-200)] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/?utm_source=pms-guide&utm_medium=nav&utm_campaign=pms-claude-guide">
            <svg className="h-5 text-[var(--ct-neutral-900)]" viewBox="0 0 450 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M167.322 98.4499H151.778V26.9487H185.664C203.85 26.9487 217.062 40.3163 217.062 58.8134V98.4499H201.518V58.6579C201.518 48.5545 194.368 40.9381 184.42 40.9381C174.628 40.9381 167.322 48.5545 167.322 58.6579V98.4499Z" fill="currentColor"/>
              <path d="M105.719 100H105.408C84.4239 100 67.6367 83.5237 67.6367 62.6951C67.6367 41.8665 84.4239 25.3901 105.408 25.3901H105.719C126.858 25.3901 143.49 41.8665 143.49 62.6951C143.49 83.5237 126.858 100 105.719 100ZM105.408 84.4563H105.719C117.688 84.4563 127.325 74.5083 127.325 62.6951C127.325 50.7264 117.688 40.9339 105.719 40.9339H105.408C93.4393 40.9339 83.8022 50.571 83.8022 62.6951C83.8022 74.6638 93.4393 84.4563 105.408 84.4563Z" fill="currentColor"/>
              <path d="M37.9667 100C16.8273 100 0.0400391 83.3682 0.0400391 62.6951C0.0400391 42.0219 16.6718 25.3901 37.8113 25.3901C47.7593 25.3901 57.241 29.2761 64.2356 36.2708L53.5105 47.1514C49.3137 42.7991 43.7179 40.623 37.8113 40.623C25.8426 40.623 16.2055 50.4155 16.2055 62.6951C16.2055 74.8192 25.9981 84.7672 37.9667 84.7672C43.8734 84.7672 49.4691 82.4356 53.5105 78.2388L64.2356 89.1194C57.241 95.9587 47.9147 100 37.9667 100Z" fill="currentColor"/>
              <path d="M410.012 97.9255H425.555V53.7813C425.555 46.4757 430.996 41.0354 438.301 41.0354H449.959V26.4243H438.301C430.996 26.4243 425.555 20.984 425.555 13.6785V0H410.012V13.6785V53.7813V97.9255Z" fill="currentColor"/>
              <path d="M383.381 16.0699H399.391V0H383.381V16.0699Z" fill="currentColor"/>
              <path d="M383.381 98.4446H399.391V26.9435H383.381V98.4446Z" fill="currentColor"/>
              <path d="M372.759 98.4499H339.029C320.843 98.4499 307.476 84.7714 307.476 66.2744V26.9487H323.019V66.7407C323.019 76.6887 330.325 84.1496 340.117 84.1496C350.065 84.1496 357.216 76.6887 357.216 66.7407V26.9487H372.759V98.4499Z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M281.311 0V26.9425H261.104C241.364 26.9425 225.354 42.9525 225.354 62.693C225.354 82.4336 241.364 98.4436 261.104 98.4436H296.855V0H281.311ZM281.777 62.693C281.777 73.8845 272.762 83.2108 261.57 83.2108C250.534 83.2108 241.519 73.8845 241.519 62.693C241.519 51.3461 250.534 42.1753 261.57 42.1753C272.762 42.1753 281.777 51.3461 281.777 62.693Z" fill="currentColor"/>
            </svg>
          </a>
          <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium bg-[var(--ct-neutral-800)] text-white px-4 py-2 rounded-md hover:bg-[var(--ct-neutral-700)] transition flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Book Setup Call
          </a>
        </div>
      </nav>

      {/* Hero — Book a call */}
      <section className="bg-white border-b border-[var(--ct-neutral-200)]">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[var(--ct-neutral-200)] overflow-hidden shrink-0">
            <Image src="/cole-headshot.jpg" alt="Cole Rubin" width={80} height={80} className="w-full h-full object-cover" unoptimized />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-semibold text-[var(--ct-neutral-900)]">Need help getting this set up?</h2>
            <p className="text-sm text-[var(--ct-neutral-500)] mt-1">Book a free 15-minute session with Cole Rubin, founder of Conduit AI. I&apos;ll walk you through it.</p>
          </div>
          <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 bg-[var(--ct-blue-700)] text-white font-medium px-6 py-3 rounded-md hover:bg-[var(--ct-blue-800)] transition flex items-center gap-2">
            Book Now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Guide Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Guide Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: guide.color }}>
            {guide.logo}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--ct-neutral-900)]">Connect {guide.name} to Claude</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${guide.difficulty === "Easy" ? "bg-green-100 text-green-700" : guide.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                {guide.difficulty}
              </span>
              <span className="text-xs text-[var(--ct-neutral-500)]">{guide.authMethod}</span>
              <a href={guide.apiDocsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--ct-blue-700)] flex items-center gap-1 hover:underline">
                API Docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <p className="text-sm text-[var(--ct-neutral-600)] leading-relaxed">{guide.description}</p>

        {/* Step 1: Install Claude */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--ct-neutral-900)] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[var(--ct-neutral-800)] text-white text-xs flex items-center justify-center font-bold">1</span>
            Install Claude
          </h2>
          <div className="bg-white border border-[var(--ct-neutral-200)] rounded-lg p-4 space-y-3">
            <p className="text-sm text-[var(--ct-neutral-600)]">Download Claude Desktop or install Claude Code CLI:</p>
            <CodeBlock code={`# Option A: Claude Desktop\n# Download from https://claude.ai/download\n\n# Option B: Claude Code CLI\nnpm install -g @anthropic-ai/claude-code`} language="bash" />
            <p className="text-sm text-[var(--ct-neutral-600)]">You&apos;ll also need Node.js 18+ and the MCP SDK:</p>
            <CodeBlock code={`mkdir ${pmsSlug}-mcp && cd ${pmsSlug}-mcp\nnpm init -y\nnpm install @modelcontextprotocol/sdk zod`} language="bash" />
          </div>
        </div>

        {/* Step 2: Get API Credentials */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--ct-neutral-900)] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[var(--ct-neutral-800)] text-white text-xs flex items-center justify-center font-bold">2</span>
            Get Your {guide.name} API Credentials
          </h2>
          <div className="bg-white border border-[var(--ct-neutral-200)] rounded-lg p-4">
            <ol className="list-decimal ml-5 space-y-2 text-sm text-[var(--ct-neutral-600)]">
              {guide.getCredentials.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-[var(--ct-neutral-500)] uppercase tracking-wider">Environment variables you&apos;ll need:</p>
              {guide.envVars.map((v) => (
                <div key={v.key} className="flex items-center gap-2 text-xs">
                  <code className="font-mono bg-[var(--ct-neutral-100)] px-1.5 py-0.5 rounded text-[var(--ct-neutral-700)]">{v.key}</code>
                  <span className="text-[var(--ct-neutral-500)]">— {v.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Build the MCP Server */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--ct-neutral-900)] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[var(--ct-neutral-800)] text-white text-xs flex items-center justify-center font-bold">3</span>
            Build the MCP Server
          </h2>
          <p className="text-sm text-[var(--ct-neutral-600)]">Create an <code className="font-mono bg-[var(--ct-neutral-100)] px-1.5 py-0.5 rounded text-[var(--ct-neutral-700)]">index.js</code> file in your project folder with this code:</p>
          <CodeBlock code={guide.mcpServerCode} language="javascript" />
        </div>

        {/* Step 4: Configure Claude */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--ct-neutral-900)] flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[var(--ct-neutral-800)] text-white text-xs flex items-center justify-center font-bold">4</span>
            Connect to Claude
          </h2>
          <p className="text-sm text-[var(--ct-neutral-600)]">Add this to your Claude Desktop config file (<code className="font-mono bg-[var(--ct-neutral-100)] px-1 py-0.5 rounded text-[var(--ct-neutral-700)]">~/Library/Application Support/Claude/claude_desktop_config.json</code>):</p>
          <CodeBlock code={guide.claudeConfig} language="json" />
          <p className="text-sm text-[var(--ct-neutral-600)]">Restart Claude Desktop. You should see the {guide.name} tools available in the tools menu.</p>
        </div>

        {/* Key Endpoints */}
        <Collapsible title={`Key ${guide.name} API Endpoints`}>
          <div className="space-y-2">
            {guide.keyEndpoints.map((ep, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={`font-mono text-xs px-1.5 py-0.5 rounded font-medium ${ep.method === "GET" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {ep.method}
                </span>
                <code className="font-mono text-xs text-[var(--ct-neutral-600)]">{ep.path}</code>
                <span className="text-xs text-[var(--ct-neutral-500)]">— {ep.desc}</span>
              </div>
            ))}
          </div>
        </Collapsible>

        {/* Tips */}
        <Collapsible title="Tips & Gotchas">
          <ul className="list-disc ml-5 space-y-1.5 text-sm text-[var(--ct-neutral-600)]">
            {guide.tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </Collapsible>
      </main>

      {/* CTA Footer — Claude Prompt */}
      <section className="bg-[var(--ct-neutral-900)] text-white">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center space-y-4">
          <Sparkles className="w-6 h-6 text-[var(--ct-blue-700)] mx-auto" />
          <h3 className="text-xl font-semibold">See what Claude thinks about {guide.name} + AI</h3>
          <p className="text-sm text-[var(--ct-neutral-400)] max-w-md mx-auto">
            Ask Claude how AI can transform your {guide.name} operations — we&apos;ve pre-loaded the perfect prompt.
          </p>
          <a
            href={claudePromptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--ct-blue-700)] text-white font-medium px-6 py-3 rounded-md hover:bg-[var(--ct-blue-800)] transition"
          >
            Try it in Claude <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--ct-neutral-200)] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-[var(--ct-neutral-400)]">Conduit AI, Inc. {new Date().getFullYear()}</span>
          <a href="/?utm_source=pms-guide&utm_medium=footer&utm_campaign=pms-claude-guide" className="text-xs text-[var(--ct-neutral-400)] hover:text-[var(--ct-neutral-700)]">All PMS Guides</a>
        </div>
      </footer>
    </div>
  );
}
