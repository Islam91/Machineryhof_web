const REQUIRED_FIELDS = ["firstName", "lastName", "email", "company", "inquiryType", "message"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECIPIENTS = [
  { email: "baher@machineryhof.com", name: "Baher" },
  { email: "islam@machinery-hof.com", name: "Islam" },
  { email: "sales@machineryhof.com", name: "Sales" }
];
const FROM_EMAIL = "no-reply@machineryhofgmbh.com";

function getDb(context) {
  return context.env?.DB;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function validate(payload) {
  for (const field of REQUIRED_FIELDS) {
    if (!payload[field] || String(payload[field]).trim().length === 0) {
      return `Missing required field: ${field}`;
    }
  }
  if (!EMAIL_PATTERN.test(payload.email)) {
    return "Invalid email address";
  }
  return null;
}

async function rateLimit(context) {
  const ip = context.request.headers.get("cf-connecting-ip") || "unknown";
  const cache = caches.default;
  const key = new Request(`https://rate-limit.internal/contact/${ip}`);
  const cached = await cache.match(key);

  if (cached) {
    return false;
  }

  const response = new Response("1", { headers: { "Cache-Control": "max-age=60" } });
  await cache.put(key, response.clone());
  return true;
}

export async function onRequestPost(context) {
  let payload;

  try {
    payload = await context.request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const validationError = validate(payload);
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const allowed = await rateLimit(context);
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests, please try again shortly." }), {
      status: 429,
      headers: { "Content-Type": "application/json" }
    });
  }

  const db = getDb(context);

  if (!db) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    await db.prepare(`
      INSERT INTO contact_inquiries (
        first_name,
        last_name,
        email,
        phone,
        company,
        inquiry_type,
        product_interest,
        message,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.phone || "",
      payload.company,
      payload.inquiryType,
      payload.productInterest || "",
      payload.message,
      new Date().toISOString()
    ).run();
  } catch (error) {
    console.error("D1 insert failed", error);
    return new Response(JSON.stringify({ error: "Submission could not be saved" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
