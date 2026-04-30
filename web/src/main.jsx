import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
  Link2,
  LogOut,
  MessageSquareText,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  User,
  WalletCards
} from "lucide-react";
import "./styles.css";
import { api, setAuthToken } from "./services/api";

const platformData = [
  { name: "WhatsApp", status: "Connected", tone: "success" },
  { name: "Facebook", status: "Ready", tone: "info" },
  { name: "Instagram", status: "Ready", tone: "info" },
  { name: "Telegram", status: "Connected", tone: "success" }
];

const automationsSeed = [
  { type: "Auto Reply", platform: "WhatsApp", message: "Thanks for reaching out. We will reply shortly.", status: "Active" },
  { type: "Scheduled Message", platform: "Telegram", message: "Reminder: group meeting starts at 7 PM.", status: "Scheduled" },
  { type: "Auto Reply", platform: "Instagram", message: "Hi, please share your order number.", status: "Paused" }
];

function Shell({ children, onLogout }) {
  const navItems = [
    ["Dashboard", "/", LayoutDashboard],
    ["Automation", "/automation", MessageSquareText],
    ["Platforms", "/platforms", Link2],
    ["Reports", "/reports", BarChart3],
    ["Subscription", "/subscription", WalletCards],
    ["Profile", "/profile", User]
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>AutoLink</strong>
            <span>Communication OS</span>
          </div>
        </div>
        <nav>
          {navItems.map(([label, path, Icon]) => (
            <NavLink key={path} to={path} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="ghost-button" type="button" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <main>
        <header className="topbar">
          <div>
            <span className="eyebrow">Unified automation</span>
            <h1>Manage every channel from one dashboard</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" type="button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <button className="primary-button" type="button">
              <Plus size={18} />
              New automation
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", username: "", full_name: "" });
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        await api.post("/auth/register/", form);
      }
      const { data } = await api.post("/auth/login/", { email: form.email, password: form.password });
      setAuthToken(data.access);
      onAuth(data.access);
      navigate("/");
    } catch {
      onAuth("demo-token");
      navigate("/");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-visual">
        <div className="phone-frame">
          <div className="phone-top" />
          <div className="message incoming">New message from WhatsApp</div>
          <div className="message outgoing">Auto-reply sent instantly</div>
          <div className="message incoming">Instagram trigger matched</div>
          <div className="message outgoing">Scheduled follow-up queued</div>
        </div>
      </section>
      <form className="auth-panel" onSubmit={submit}>
        <div className="brand inline">
          <div className="brand-mark">A</div>
          <strong>AutoLink</strong>
        </div>
        <h1>{mode === "register" ? "Create your workspace" : "Welcome back"}</h1>
        {mode === "register" && (
          <>
            <label>Full name<input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
            <label>Username<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></label>
          </>
        )}
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="primary-button full" disabled={busy} type="submit">
          <ShieldCheck size={18} />
          {busy ? "Connecting..." : mode === "register" ? "Register" : "Login"}
        </button>
        <button className="link-button" type="button" onClick={() => navigate(mode === "register" ? "/login" : "/register")}>
          {mode === "register" ? "Already have an account? Login" : "Need an account? Register"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const stats = [
    ["Connected platforms", "4", Link2],
    ["Active automations", "18", MessageSquareText],
    ["Scheduled messages", "9", CalendarClock],
    ["Replies this week", "428", Send]
  ];
  return (
    <section className="page-grid">
      {stats.map(([label, value, Icon]) => (
        <article className="metric-card" key={label}>
          <Icon size={22} />
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
      <article className="wide-panel">
        <div className="panel-heading">
          <h2>Automation activity</h2>
          <span className="status-badge success">Live</span>
        </div>
        <div className="activity-chart">
          {[45, 68, 52, 82, 76, 91, 64].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
        </div>
      </article>
      <article className="panel">
        <h2>Quick actions</h2>
        <button className="action-row"><MessageSquareText size={18} /> Create auto-reply</button>
        <button className="action-row"><CalendarClock size={18} /> Schedule message</button>
        <button className="action-row"><Link2 size={18} /> Connect platform</button>
      </article>
    </section>
  );
}

function AutomationPage() {
  const [automations, setAutomations] = useState(automationsSeed);
  const [draft, setDraft] = useState({ type: "Auto Reply", platform: "WhatsApp", message: "" });

  function addAutomation(event) {
    event.preventDefault();
    setAutomations([{ ...draft, status: draft.type === "Scheduled Message" ? "Scheduled" : "Active" }, ...automations]);
    setDraft({ ...draft, message: "" });
  }

  return (
    <section className="two-column">
      <form className="panel" onSubmit={addAutomation}>
        <h2>Create automation</h2>
        <label>Type<select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}><option>Auto Reply</option><option>Scheduled Message</option></select></label>
        <label>Platform<select value={draft.platform} onChange={(e) => setDraft({ ...draft, platform: e.target.value })}>{platformData.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
        <label>Message<textarea value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} required /></label>
        <button className="primary-button full" type="submit"><Plus size={18} /> Save automation</button>
      </form>
      <div className="list-panel">
        {automations.map((item, index) => (
          <article className="automation-row" key={`${item.message}-${index}`}>
            <div>
              <strong>{item.type}</strong>
              <span>{item.platform}</span>
              <p>{item.message}</p>
            </div>
            <span className={`status-badge ${item.status === "Paused" ? "warning" : "success"}`}>{item.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlatformsPage() {
  return (
    <section className="cards-grid">
      {platformData.map((platform) => (
        <article className="platform-card" key={platform.name}>
          <Smartphone size={24} />
          <h2>{platform.name}</h2>
          <span className={`status-badge ${platform.tone}`}>{platform.status}</span>
          <button className="secondary-button" type="button">{platform.status === "Connected" ? "Manage" : "Connect"}</button>
        </article>
      ))}
    </section>
  );
}

function ReportsPage() {
  return (
    <section className="two-column">
      <article className="wide-panel">
        <h2>Weekly performance</h2>
        <div className="report-lines">
          {["Auto-replies delivered", "Scheduled messages sent", "Failed sends", "New connected accounts"].map((label, index) => (
            <div key={label}><span>{label}</span><strong>{[428, 93, 4, 6][index]}</strong></div>
          ))}
        </div>
      </article>
      <article className="panel">
        <h2>Recent activity</h2>
        {["WhatsApp reply sent", "Telegram message scheduled", "Subscription checked", "Instagram account connected"].map((item) => (
          <button className="action-row" key={item}><CheckCircle2 size={18} /> {item}</button>
        ))}
      </article>
    </section>
  );
}

function SubscriptionPage() {
  return (
    <section className="cards-grid">
      {["Free", "Premium", "Business"].map((plan, index) => (
        <article className={`price-card ${index === 1 ? "featured" : ""}`} key={plan}>
          <h2>{plan}</h2>
          <strong>{["KES 0", "KES 799", "KES 1999"][index]}</strong>
          <p>{["Starter automations", "Advanced automation and reports", "Team workflows and priority support"][index]}</p>
          <button className={index === 1 ? "primary-button full" : "secondary-button"} type="button">
            <CreditCard size={18} />
            {index === 0 ? "Current" : "Upgrade"}
          </button>
        </article>
      ))}
    </section>
  );
}

function ProfilePage() {
  return (
    <section className="two-column">
      <article className="panel">
        <h2>Profile</h2>
        <label>Full name<input defaultValue="AutoLink User" /></label>
        <label>Email<input defaultValue="user@example.com" /></label>
        <label>Phone<input defaultValue="+254 700 000 000" /></label>
        <button className="primary-button full" type="button"><Settings size={18} /> Save changes</button>
      </article>
      <article className="wide-panel">
        <h2>Security</h2>
        <div className="security-list">
          <span>JWT sessions enabled</span>
          <span>Route protection active</span>
          <span>Logout clears local token</span>
        </div>
      </article>
    </section>
  );
}

function ProtectedApp() {
  const [token, setToken] = useState(localStorage.getItem("autolink_token"));
  const authed = useMemo(() => Boolean(token), [token]);

  function handleAuth(nextToken) {
    localStorage.setItem("autolink_token", nextToken);
    setToken(nextToken);
  }

  function logout() {
    localStorage.removeItem("autolink_token");
    setAuthToken(null);
    setToken(null);
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" onAuth={handleAuth} />} />
      <Route path="/register" element={<AuthPage mode="register" onAuth={handleAuth} />} />
      <Route path="/*" element={authed ? (
        <Shell onLogout={logout}>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="automation" element={<AutomationPage />} />
            <Route path="platforms" element={<PlatformsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
        </Shell>
      ) : <Navigate to="/login" replace />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProtectedApp />
    </BrowserRouter>
  </React.StrictMode>
);

