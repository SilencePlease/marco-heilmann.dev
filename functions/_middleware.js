export async function onRequest(context) {
  const { request, env, next } = context;

  // 1) Wartungsmodus: allen die 503-Seite zeigen
  if (env.MAINTENANCE === "on") {
    return new Response(maintenanceHTML(), {
      status: 503,
      headers: { "Content-Type": "text/html; charset=UTF-8", "Retry-After": "3600" },
    });
  }

  // 2) Optional: Passwortschutz (verstecken bis Launch)
  if (env.SITE_PASSWORD && !authOk(request, env.SITE_PASSWORD)) {
    return new Response("Zugang erforderlich", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="marco-heilmann.dev"' },
    });
  }

  // 3) Normalbetrieb: statische Seite ausliefern
  return next();
}

function authOk(request, password) {
  const h = request.headers.get("Authorization") || "";
  if (!h.startsWith("Basic ")) return false;
  const pass = atob(h.slice(6)).split(":").slice(1).join(":"); // Benutzer egal, nur Passwort zählt
  return pass === password;
}

function maintenanceHTML() {
  return `<!DOCTYPE html><html lang="de"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wartung</title><style>body{font-family:system-ui,sans-serif;max-width:40rem;
margin:20vh auto;padding:0 1.5rem;text-align:center}
@media(prefers-color-scheme:dark){body{background:#1b1b1b;color:#eee}}</style></head>
<body><h1>Kurz nicht erreichbar 🔧</h1><p>An der Seite wird gerade gearbeitet.</p></body></html>`;
}