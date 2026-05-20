const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const routeGroups = [
  {
    title: "Core",
    routes: [
      { method: "GET", path: "/", desc: "API landing page" },
      { method: "GET", path: "/api/health", desc: "Service health summary" },
      {
        method: "GET",
        path: "/api/health/db",
        desc: "Database health details",
      },
      { method: "GET", path: "/api/docs", desc: "Swagger documentation" },
    ],
  },
  {
    title: "Auth",
    routes: [
      { method: "POST", path: "/api/auth/register", desc: "Create account" },
      { method: "POST", path: "/api/auth/login", desc: "Get JWT token" },
      {
        method: "POST",
        path: "/api/auth/forgot-password",
        desc: "Send reset email",
      },
      {
        method: "POST",
        path: "/api/auth/reset-password",
        desc: "Reset password",
      },
      {
        method: "PUT",
        path: "/api/auth/change-password",
        desc: "Update password",
        auth: true,
      },
    ],
  },
  {
    title: "Donors",
    routes: [
      { method: "GET", path: "/api/donors", desc: "List donors", auth: true },
      {
        method: "POST",
        path: "/api/donors",
        desc: "Create donor profile",
        auth: true,
      },
      {
        method: "GET",
        path: "/api/donors/:id",
        desc: "View donor profile",
        auth: true,
      },
      {
        method: "PATCH",
        path: "/api/donors/:id",
        desc: "Update donor profile",
        auth: true,
      },
    ],
  },
  {
    title: "Donations",
    routes: [
      {
        method: "GET",
        path: "/api/donations",
        desc: "List donations",
        auth: true,
      },
      {
        method: "POST",
        path: "/api/donations",
        desc: "Record donation",
        auth: true,
      },
      {
        method: "GET",
        path: "/api/donations/:id",
        desc: "View donation",
        auth: true,
      },
      {
        method: "PATCH",
        path: "/api/donations/:id",
        desc: "Update donation",
        auth: true,
      },
    ],
  },
  {
    title: "Projects",
    routes: [
      {
        method: "GET",
        path: "/api/projects",
        desc: "List projects",
        auth: true,
      },
      {
        method: "POST",
        path: "/api/projects",
        desc: "Create project",
        auth: true,
      },
      {
        method: "GET",
        path: "/api/projects/:id",
        desc: "View project",
        auth: true,
      },
      {
        method: "PATCH",
        path: "/api/projects/:id",
        desc: "Update project",
        auth: true,
      },
      {
        method: "DELETE",
        path: "/api/projects/:id",
        desc: "Delete project",
        auth: true,
      },
    ],
  },
  {
    title: "Events",
    routes: [
      {
        method: "GET",
        path: "/api/events",
        desc: "List events",
        auth: true,
      },
      {
        method: "POST",
        path: "/api/events",
        desc: "Create event",
        auth: true,
      },
      {
        method: "GET",
        path: "/api/events/:id",
        desc: "View event",
        auth: true,
      },
      {
        method: "PUT",
        path: "/api/events/:id",
        desc: "Update event",
        auth: true,
      },
      {
        method: "DELETE",
        path: "/api/events/:id",
        desc: "Delete event",
        auth: true,
      },
    ],
  },
  {
    title: "Volunteers",
    routes: [
      {
        method: "GET",
        path: "/api/volunteers",
        desc: "List volunteers",
      },
      {
        method: "POST",
        path: "/api/volunteers",
        desc: "Register volunteer",
      },
      {
        method: "GET",
        path: "/api/volunteers/:id",
        desc: "View volunteer",
      },
      {
        method: "PATCH",
        path: "/api/volunteers/:id",
        desc: "Update volunteer",
      },
      {
        method: "PATCH",
        path: "/api/volunteers/:id/approve",
        desc: "Approve volunteer",
        auth: true,
      },
      {
        method: "PATCH",
        path: "/api/volunteers/:id/reject",
        desc: "Reject volunteer",
        auth: true,
      },
      {
        method: "PATCH",
        path: "/api/volunteers/:id/assign",
        desc: "Assign to project",
        auth: true,
      },
      {
        method: "DELETE",
        path: "/api/volunteers/:id",
        desc: "Delete volunteer",
      },
    ],
  },
  {
    title: "Beneficiaries",
    routes: [
      {
        method: "GET",
        path: "/api/beneficiaries",
        desc: "List beneficiaries",
      },
      {
        method: "POST",
        path: "/api/beneficiaries",
        desc: "Register beneficiary",
      },
      {
        method: "GET",
        path: "/api/beneficiaries/:id",
        desc: "View beneficiary",
      },
      {
        method: "PATCH",
        path: "/api/beneficiaries/:id",
        desc: "Update beneficiary",
      },
      {
        method: "DELETE",
        path: "/api/beneficiaries/:id",
        desc: "Delete beneficiary",
      },
    ],
  },
  {
    title: "Payment",
    routes: [
      {
        method: "POST",
        path: "/api/payment/initialize",
        desc: "Initialize Paystack payment",
      },
      {
        method: "GET",
        path: "/api/payment/verify/:reference",
        desc: "Verify payment status",
      },
      {
        method: "POST",
        path: "/api/payment/webhook",
        desc: "Paystack webhook receiver",
      },
    ],
  },
  {
    title: "Reports",
    routes: [
      {
        method: "GET",
        path: "/api/reports/donations-summary",
        desc: "Donations summary",
      },
      {
        method: "GET",
        path: "/api/reports/projects",
        desc: "Projects report",
      },
      {
        method: "GET",
        path: "/api/reports/transparency",
        desc: "Transparency report",
      },
      {
        method: "GET",
        path: "/dashboard",
        desc: "Dashboard metrics",
      },
    ],
  },
];

const methodMeta = {
  GET: { color: "#10b981", bg: "rgba(16,185,129,0.10)", label: "GET" },
  POST: { color: "#3b82f6", bg: "rgba(59,130,246,0.10)", label: "POST" },
  PUT: { color: "#f59e0b", bg: "rgba(245,158,11,0.10)", label: "PUT" },
  PATCH: { color: "#f59e0b", bg: "rgba(245,158,11,0.10)", label: "PATCH" },
  DELETE: { color: "#ef4444", bg: "rgba(239,68,68,0.10)", label: "DELETE" },
};

const renderRoute = (route) => {
  const m = methodMeta[route.method] || methodMeta.GET;
  return `
    <div class="route-row">
      <span class="method-badge" style="color:${m.color};background:${m.bg}">${escapeHtml(route.method)}</span>
      <code class="route-path">${escapeHtml(route.path)}</code>
      <span class="route-desc">${escapeHtml(route.desc)}</span>
      ${route.auth ? '<span class="jwt-badge">JWT</span>' : '<span class="jwt-spacer"></span>'}
    </div>`;
};

const renderGroup = (group) => `
  <div class="group-card">
    <div class="group-header">
      <span class="group-icon" aria-hidden="true">
        ${{ Core: "⬡", Auth: "🔐", Donors: "👥", Donations: "💰", Projects: "📋", Events: "📅", Volunteers: "🙋", Beneficiaries: "🤝", Payment: "💳", Reports: "📊" }[group.title] || "⬡"}
      </span>
      <span class="group-title">${escapeHtml(group.title)}</span>
      <span class="group-count">${group.routes.length} routes</span>
    </div>
    <div class="group-routes">
      ${group.routes.map(renderRoute).join("")}
    </div>
  </div>`;

const renderApiRootPage = ({
  port,
  env,
  dbStatus,
  smtpConfigured,
  requestIp,
  uptimeSeconds,
}) => {
  const isUp = dbStatus === "connected";
  const uptimeLabel =
    uptimeSeconds < 60
      ? `${uptimeSeconds}s`
      : uptimeSeconds < 3600
        ? `${Math.floor(uptimeSeconds / 60)}m ${uptimeSeconds % 60}s`
        : `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`;
  const routeCount = routeGroups.reduce((t, g) => t + g.routes.length, 0);
  const authCount = routeGroups
    .flatMap((g) => g.routes)
    .filter((r) => r.auth).length;
  const now = new Date().toUTCString();

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>NGO API — ${escapeHtml(env)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #0c0e10;
      --surface:   #131619;
      --surface2:  #1a1e22;
      --border:    rgba(255,255,255,0.07);
      --border2:   rgba(255,255,255,0.12);
      --text:      #e8eaec;
      --muted:     #6b7785;
      --muted2:    #8e99a6;
      --accent:    #10b981;
      --accent-bg: rgba(16,185,129,0.08);
      --warn:      #f59e0b;
      --warn-bg:   rgba(245,158,11,0.08);
      --danger:    #ef4444;
      --blue:      #3b82f6;
      --mono:      'IBM Plex Mono', monospace;
      --sans:      'IBM Plex Sans', sans-serif;
      --radius:    8px;
      --radius-lg: 14px;
    }

    html { font-size: 15px; }

    body {
      font-family: var(--sans);
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.6;
    }

    /* ─── Top bar ─── */
    .topbar {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; gap: 12px;
      padding: 0 28px; height: 52px;
      background: rgba(12,14,16,0.88);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .topbar-logo {
      font-family: var(--mono);
      font-size: 13px; font-weight: 600;
      color: var(--accent);
      letter-spacing: 0.06em;
    }
    .topbar-slash { color: var(--border2); }
    .topbar-env {
      font-family: var(--mono); font-size: 11px;
      color: var(--muted2);
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 2px 8px;
    }
    .topbar-spacer { flex: 1; }
    .status-pill {
      display: inline-flex; align-items: center; gap: 7px;
      font-family: var(--mono); font-size: 11px;
      font-weight: 500; letter-spacing: 0.06em;
      padding: 5px 12px;
      border-radius: 999px;
      background: ${isUp ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)"};
      color: ${isUp ? "var(--accent)" : "var(--danger)"};
      border: 1px solid ${isUp ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.22)"};
    }
    .status-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: ${isUp ? "var(--accent)" : "var(--danger)"};
      animation: ${isUp ? "pulse 2s infinite" : "none"};
    }
    @keyframes pulse {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.35; }
    }
    .topbar-link {
      font-family: var(--mono); font-size: 11px;
      color: var(--muted2); text-decoration: none;
      padding: 5px 10px; border-radius: var(--radius);
      border: 1px solid var(--border);
      transition: border-color 0.15s, color 0.15s;
    }
    .topbar-link:hover { border-color: var(--border2); color: var(--text); }

    /* ─── Main layout ─── */
    .shell { max-width: 1100px; margin: 0 auto; padding: 40px 24px 64px; }

    /* ─── Hero ─── */
    .hero {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 24px;
      margin-bottom: 28px;
    }
    .hero-left {}
    .tagline {
      font-family: var(--mono); font-size: 11px;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--accent); margin-bottom: 14px;
    }
    .hero-title {
      font-family: var(--sans); font-size: clamp(32px, 5vw, 52px);
      font-weight: 300; line-height: 1.12;
      letter-spacing: -0.03em;
      color: var(--text);
      margin-bottom: 16px;
    }
    .hero-title strong { font-weight: 600; }
    .hero-desc {
      font-size: 14px; color: var(--muted2);
      max-width: 520px; line-height: 1.75;
      margin-bottom: 24px;
    }
    .hero-desc code {
      font-family: var(--mono); font-size: 0.9em;
      background: var(--surface2);
      border: 1px solid var(--border2);
      color: var(--accent);
      padding: 1px 6px; border-radius: 4px;
    }
    .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn {
      display: inline-flex; align-items: center; gap: 7px;
      font-family: var(--mono); font-size: 12px; font-weight: 500;
      letter-spacing: 0.07em;
      padding: 9px 18px; border-radius: var(--radius);
      text-decoration: none; border: 1px solid transparent;
      transition: all 0.15s;
    }
    .btn-primary {
      background: var(--accent); color: #0c0e10;
      border-color: var(--accent);
    }
    .btn-primary:hover { filter: brightness(1.1); }
    .btn-ghost {
      background: transparent; color: var(--muted2);
      border-color: var(--border2);
    }
    .btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.22); }

    /* ─── Runtime card ─── */
    .runtime-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .runtime-card-header {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      font-family: var(--mono); font-size: 11px;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--muted);
      display: flex; align-items: center; gap: 8px;
    }
    .runtime-card-header::before {
      content: '';
      display: inline-block; width: 8px; height: 8px;
      border-radius: 50%; background: var(--surface2);
      border: 1px solid var(--border2);
    }
    .runtime-rows { padding: 4px 0; }
    .runtime-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 9px 18px;
      border-bottom: 1px solid var(--border);
      font-family: var(--mono); font-size: 12px;
    }
    .runtime-row:last-child { border-bottom: none; }
    .runtime-key { color: var(--muted); }
    .runtime-val { color: var(--text); }
    .runtime-val.ok  { color: var(--accent); }
    .runtime-val.warn { color: var(--warn); }
    .runtime-val.danger { color: var(--danger); }

    /* ─── Stats row ─── */
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
    }
    .stat-value {
      font-family: var(--mono); font-size: 26px; font-weight: 600;
      color: var(--text); margin-bottom: 4px;
    }
    .stat-label {
      font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--muted);
    }

    /* ─── Route grid ─── */
    .routes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .group-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .group-header {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--border);
      background: var(--surface2);
    }
    .group-icon { font-size: 12px; color: var(--muted); line-height: 1; }
    .group-title {
      font-family: var(--mono); font-size: 12px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--text); flex: 1;
    }
    .group-count {
      font-family: var(--mono); font-size: 11px;
      color: var(--muted);
    }
    .group-routes { padding: 4px 0; }
    .route-row {
      display: grid;
      grid-template-columns: 58px 1fr auto auto;
      align-items: center; gap: 10px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
      transition: background 0.1s;
    }
    .route-row:last-child { border-bottom: none; }
    .route-row:hover { background: rgba(255,255,255,0.025); }
    .method-badge {
      font-family: var(--mono); font-size: 10px; font-weight: 600;
      letter-spacing: 0.06em;
      padding: 3px 8px; border-radius: 4px;
      text-align: center; white-space: nowrap;
    }
    .route-path {
      font-family: var(--mono); font-size: 12px;
      color: var(--text); word-break: break-all;
    }
    .route-desc {
      font-size: 12px; color: var(--muted2);
      text-align: right; white-space: nowrap;
    }
    .jwt-badge {
      font-family: var(--mono); font-size: 10px; font-weight: 600;
      padding: 2px 7px; border-radius: 4px;
      background: rgba(59,130,246,0.12);
      color: var(--blue);
      border: 1px solid rgba(59,130,246,0.2);
      white-space: nowrap;
    }
    .jwt-spacer { width: 36px; }

    /* ─── Footer ─── */
    .footer {
      margin-top: 32px;
      padding-top: 18px;
      border-top: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 10px;
      font-family: var(--mono); font-size: 11px;
      color: var(--muted);
    }
    .footer-roles { display: flex; gap: 8px; flex-wrap: wrap; }
    .role-tag {
      padding: 3px 9px; border-radius: 4px;
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--muted2);
    }

    /* ─── Responsive ─── */
    @media (max-width: 860px) {
      .hero        { grid-template-columns: 1fr; }
      .stats       { grid-template-columns: 1fr 1fr; }
      .routes-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 560px) {
      .stats        { grid-template-columns: 1fr 1fr; }
      .route-row    { grid-template-columns: 52px 1fr; }
      .route-desc, .jwt-badge, .jwt-spacer { display: none; }
      .topbar       { padding: 0 14px; }
      .shell        { padding-inline: 14px; }
    }
  </style>
</head>
<body>

  <!-- Top bar -->
  <nav class="topbar">
    <span class="topbar-logo">NGO/API</span>
    <span class="topbar-slash">/</span>
    <span class="topbar-env">${escapeHtml(env)}</span>
    <span class="topbar-spacer"></span>
    <div class="status-pill">
      <span class="status-dot"></span>
      ${escapeHtml(isUp ? "OPERATIONAL" : "DEGRADED")}
    </div>
    <a class="topbar-link" href="/api/docs">Swagger →</a>
    <a class="topbar-link" href="/api/health">Health →</a>
  </nav>

  <main class="shell">

    <!-- Hero -->
    <div class="hero">
      <div class="hero-left">
        <p class="tagline">NGO Management System</p>
        <h1 class="hero-title">
          Backend <strong>API</strong><br/>
          v1.0 · REST
        </h1>
        <p class="hero-desc">
          Powers donor management, donation tracking, authentication, and
          operational health for the NGO platform. All endpoints live under
          <code>/api</code>. Protected routes require a signed
          <code>Bearer</code> JWT in the <code>Authorization</code> header.
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/api/docs">Open Swagger Docs</a>
          <a class="btn btn-ghost"   href="/api/health">Health Check</a>
          <a class="btn btn-ghost"   href="/api/health/db">DB Status</a>
        </div>
      </div>

      <!-- Runtime snapshot -->
      <div class="runtime-card">
        <div class="runtime-card-header">Runtime snapshot</div>
        <div class="runtime-rows">
          <div class="runtime-row">
            <span class="runtime-key">env</span>
            <span class="runtime-val">${escapeHtml(env)}</span>
          </div>
          <div class="runtime-row">
            <span class="runtime-key">port</span>
            <span class="runtime-val">${escapeHtml(String(port))}</span>
          </div>
          <div class="runtime-row">
            <span class="runtime-key">database</span>
            <span class="runtime-val ${isUp ? "ok" : "danger"}">${escapeHtml(dbStatus)}</span>
          </div>
          <div class="runtime-row">
            <span class="runtime-key">smtp</span>
            <span class="runtime-val ${smtpConfigured ? "ok" : "warn"}">${escapeHtml(smtpConfigured ? "configured" : "unconfigured")}</span>
          </div>
          <div class="runtime-row">
            <span class="runtime-key">uptime</span>
            <span class="runtime-val">${escapeHtml(uptimeLabel)}</span>
          </div>
          <div class="runtime-row">
            <span class="runtime-key">client</span>
            <span class="runtime-val">${escapeHtml(requestIp)}</span>
          </div>
          <div class="runtime-row">
            <span class="runtime-key">generated</span>
            <span class="runtime-val" style="font-size:10px;color:var(--muted)">${escapeHtml(now)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${routeGroups.length}</div>
        <div class="stat-label">Route groups</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${routeCount}</div>
        <div class="stat-label">Total routes</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${authCount}</div>
        <div class="stat-label">Auth-required</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:${isUp ? "var(--accent)" : "var(--danger)"}">${isUp ? "OK" : "WARN"}</div>
        <div class="stat-label">DB state</div>
      </div>
    </div>

    <!-- Route groups -->
    <div class="routes-grid">
      ${routeGroups.map(renderGroup).join("")}
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-roles">
        <span style="color:var(--muted);margin-right:4px">roles</span>
        ${["admin", "staff", "donor", "volunteer", "public"].map((r) => `<span class="role-tag">${r}</span>`).join("")}
      </div>
      <span>port ${escapeHtml(String(port))} · ${escapeHtml(env)}</span>
    </footer>

  </main>
</body>
</html>`;
};

export default renderApiRootPage;
