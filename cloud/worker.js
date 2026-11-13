/**
 * BONK cloud — sauvegarde d'un duo.
 *
 * Le client n'envoie jamais son compte : il envoie l'empreinte SHA-256 de son
 * nom de compte (64 caractères hexadécimaux), qui sert de clé. Le service
 * stocke donc le duo (code, binôme, comptes, stats) sous une clé opaque, et ne
 * permet ni de lister ni de parcourir les enregistrements.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Max-Age": "86400",
};

const KEY_RE = /^[a-f0-9]{64}$/;
const CODE_RE = /^[A-Z0-9]{6}$/;
const STATS_MAX = 300;

let schemaReady = false;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...CORS },
  });
}

async function ensureSchema(db) {
  if (schemaReady) return;
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS duo (k TEXT PRIMARY KEY, code TEXT NOT NULL, partner TEXT, " +
        "partner_user TEXT, stats TEXT, updated_at INTEGER NOT NULL)",
    )
    .run();
  // Bases créées avant l'arrivée des duos liés et des stats.
  for (const column of ["partner_user TEXT", "stats TEXT"]) {
    try {
      await db.prepare(`ALTER TABLE duo ADD COLUMN ${column}`).run();
    } catch {
      /* colonne déjà présente */
    }
  }
  schemaReady = true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (url.pathname !== "/v1/duo") return json({ error: "not_found" }, 404);

    const db = env.DB;
    if (!db) return json({ error: "storage_unavailable" }, 503);

    try {
      await ensureSchema(db);

      if (request.method === "GET") {
        const key = url.searchParams.get("k") || "";
        if (!KEY_RE.test(key)) return json({ error: "bad_key" }, 400);
        const row = await db
          .prepare("SELECT code, partner, partner_user, stats FROM duo WHERE k = ?")
          .bind(key)
          .first();
        if (!row) return json({ found: false }, 404);
        let stats = [];
        try {
          stats = row.stats ? JSON.parse(row.stats) : [];
        } catch {
          stats = [];
        }
        return json({
          found: true,
          code: row.code,
          partner: row.partner || "",
          partner_user: row.partner_user || "",
          stats: Array.isArray(stats) ? stats.slice(-STATS_MAX) : [],
        });
      }

      if (request.method === "POST") {
        let body;
        try {
          body = await request.json();
        } catch {
          return json({ error: "bad_json" }, 400);
        }

        const key = String(body?.k || "");
        const code = String(body?.code || "").toUpperCase();
        const partner = String(body?.partner || "").slice(0, 40);
        const partnerUser = String(body?.partnerUser || "").trim().toLowerCase().slice(0, 60);
        if (!KEY_RE.test(key)) return json({ error: "bad_key" }, 400);
        // Code vide = le duo a été délié : on efface la copie en ligne.
        if (code === "") {
          await db.prepare("DELETE FROM duo WHERE k = ?").bind(key).run();
          return json({ ok: true, removed: true });
        }
        if (!CODE_RE.test(code)) return json({ error: "bad_code" }, 400);

        const plays = Array.isArray(body?.stats) ? body.stats.slice(-STATS_MAX) : [];
        const stats = plays.length ? JSON.stringify(plays) : null;

        await db
          .prepare(
            "INSERT INTO duo (k, code, partner, partner_user, stats, updated_at) VALUES (?, ?, ?, ?, ?, ?) " +
              "ON CONFLICT(k) DO UPDATE SET code = excluded.code, partner = excluded.partner, " +
              "partner_user = excluded.partner_user, stats = excluded.stats, updated_at = excluded.updated_at",
          )
          .bind(key, code, partner, partnerUser, stats, Date.now())
          .run();

        return json({ ok: true });
      }

      return json({ error: "method_not_allowed" }, 405);
    } catch (error) {
      return json({ error: "server_error", detail: String(error?.message || error).slice(0, 200) }, 500);
    }
  },
};
