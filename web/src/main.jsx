import React, { useEffect, useMemo, useState } from "react";
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
  Trash2,
  User,
  WalletCards
} from "lucide-react";
import "./styles.css";
import { api, setAuthToken } from "./services/api";

function useApiState(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    setError("");
    try {
      setData(await loader());
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, deps);

  return { data, setData, loading, error, reload };
}

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
        <div className="brand"><div className="brand-mark">A</div><div><strong>AutoLink</strong><span>Communication OS</span></div></div>
        <nav>
          {navItems.map(([label, path, Icon]) => (
            <NavLink key={path} to={path} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <button className="ghost-button" type="button" onClick={onLogout}><LogOut size={18} />Logout</button>
      </aside>
      <main>
        <header className="topbar">
          <div><span className="eyebrow">Unified automation</span><h1>Manage every channel from one dashboard</h1></div>
          <div className="top-actions">
            <button className="icon-button" type="button" aria-label="Notifications"><Bell size={19} /></button>
            <NavLink className="primary-button" to="/automation"><Plus size={18} />New automation</NavLink>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", username: "", full_name: "", phone_number: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "register") await api.post("/auth/register/", form);
      const { data } = await api.post("/auth/login/", { email: form.email, password: form.password });
      onAuth(data.access, data.refresh);
      navigate("/");
    } catch (err) {
      const message = err.response?.data ? JSON.stringify(err.response.data) : "Authentication failed.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-visual">
        <div className="phone-frame">
          <div className="phone-top" />
          <div className="message incoming">New WhatsApp message</div>
          <div className="message outgoing">Auto-reply sent instantly</div>
          <div className="message incoming">Instagram trigger matched</div>
          <div className="message outgoing">Scheduled follow-up queued</div>
        </div>
      </section>
      <form className="auth-panel" onSubmit={submit}>
        <div className="brand inline"><div className="brand-mark">A</div><strong>AutoLink</strong></div>
        <h1>{mode === "register" ? "Create your workspace" : "Welcome back"}</h1>
        {error && <p className="form-error">{error}</p>}
        {mode === "register" && (
          <>
            <label>Full name<input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
            <label>Username<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></label>
            <label>Phone<input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} /></label>
          </>
        )}
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="primary-button full" disabled={busy} type="submit"><ShieldCheck size={18} />{busy ? "Connecting..." : mode === "register" ? "Register" : "Login"}</button>
        <button className="link-button" type="button" onClick={() => navigate(mode === "register" ? "/login" : "/register")}>
          {mode === "register" ? "Already have an account? Login" : "Need an account? Register"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const summary = useApiState(async () => (await api.get("/reports/summary/")).data, []);
  const automations = useApiState(async () => (await api.get("/automation/list/")).data, []);
  const platforms = useApiState(async () => (await api.get("/platform/list/")).data, []);
  const stats = [
    ["Connected platforms", platforms.data?.length || 0, Link2],
    ["Active automations", summary.data?.active_automations || 0, MessageSquareText],
    ["Total automations", summary.data?.automations || 0, CalendarClock],
    ["Activity logs", summary.data?.activity_logs || 0, Send]
  ];

  return (
    <section className="page-grid">
      {stats.map(([label, value, Icon]) => <article className="metric-card" key={label}><Icon size={22} /><span>{label}</span><strong>{value}</strong></article>)}
      <article className="wide-panel">
        <div className="panel-heading"><h2>Automation activity</h2><span className="status-badge success">Live API</span></div>
        <div className="activity-chart">{[45, 68, 52, 82, 76, 91, 64].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>
      </article>
      <article className="panel">
        <h2>Recent automations</h2>
        {(automations.data || []).slice(0, 4).map((item) => <button className="action-row" key={item.id}><MessageSquareText size={18} />{item.type.replace("_", " ")}</button>)}
        {!automations.loading && !automations.data?.length && <p className="muted">No automations yet.</p>}
      </article>
    </section>
  );
}

function AutomationPage() {
  const automations = useApiState(async () => (await api.get("/automation/list/")).data, []);
  const accounts = useApiState(async () => (await api.get("/platform/list/")).data, []);
  const [draft, setDraft] = useState({ type: "auto_reply", connected_account: "", trigger: "", message: "", schedule_time: "" });
  const [error, setError] = useState("");

  async function addAutomation(event) {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        ...draft,
        connected_account: draft.connected_account || null,
        schedule_time: draft.schedule_time || null
      };
      await api.post("/automation/create/", payload);
      setDraft({ type: "auto_reply", connected_account: "", trigger: "", message: "", schedule_time: "" });
      automations.reload();
    } catch (err) {
      setError(JSON.stringify(err.response?.data || "Could not save automation."));
    }
  }

  async function toggle(id) {
    await api.post(`/automation/toggle/${id}/`);
    automations.reload();
  }

  async function remove(id) {
    await api.delete(`/automation/delete/${id}/`);
    automations.reload();
  }

  return (
    <section className="two-column">
      <form className="panel" onSubmit={addAutomation}>
        <h2>Create automation</h2>
        {error && <p className="form-error">{error}</p>}
        <label>Type<select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}><option value="auto_reply">Auto Reply</option><option value="scheduled_message">Scheduled Message</option></select></label>
        <label>Platform account<select value={draft.connected_account} onChange={(e) => setDraft({ ...draft, connected_account: e.target.value })}><option value="">Any connected account</option>{(accounts.data || []).map((account) => <option key={account.id} value={account.id}>{account.platform} {account.account_name && `- ${account.account_name}`}</option>)}</select></label>
        <label>Trigger<input value={draft.trigger} onChange={(e) => setDraft({ ...draft, trigger: e.target.value })} placeholder="keyword or condition" /></label>
        <label>Schedule time<input type="datetime-local" value={draft.schedule_time} onChange={(e) => setDraft({ ...draft, schedule_time: e.target.value })} /></label>
        <label>Message<textarea value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} required /></label>
        <button className="primary-button full" type="submit"><Plus size={18} />Save automation</button>
      </form>
      <div className="list-panel">
        {automations.loading && <article className="automation-row"><strong>Loading automations...</strong></article>}
        {(automations.data || []).map((item) => (
          <article className="automation-row" key={item.id}>
            <div>
              <strong>{item.type.replace("_", " ")}</strong>
              <span>{item.trigger || "No trigger"} {item.schedule_time ? `- ${new Date(item.schedule_time).toLocaleString()}` : ""}</span>
              <p>{item.message}</p>
            </div>
            <div className="row-actions">
              <button className={`status-badge ${item.is_active ? "success" : "warning"}`} type="button" onClick={() => toggle(item.id)}>{item.is_active ? "Active" : "Paused"}</button>
              <button className="icon-button" type="button" onClick={() => remove(item.id)} aria-label="Delete automation"><Trash2 size={17} /></button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlatformsPage() {
  const accounts = useApiState(async () => (await api.get("/platform/list/")).data, []);
  const [draft, setDraft] = useState({ platform: "whatsapp", account_name: "", external_account_id: "", token: "" });

  async function connect(event) {
    event.preventDefault();
    await api.post("/platform/connect/", { ...draft, token: draft.token || "development-token" });
    setDraft({ ...draft, account_name: "", external_account_id: "", token: "" });
    accounts.reload();
  }

  async function disconnect(id) {
    await api.delete(`/platform/disconnect/${id}/`);
    accounts.reload();
  }

  return (
    <section className="two-column">
      <form className="panel" onSubmit={connect}>
        <h2>Connect platform</h2>
        <label>Platform<select value={draft.platform} onChange={(e) => setDraft({ ...draft, platform: e.target.value })}><option value="whatsapp">WhatsApp</option><option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="telegram">Telegram</option></select></label>
        <label>Account name<input value={draft.account_name} onChange={(e) => setDraft({ ...draft, account_name: e.target.value })} /></label>
        <label>External account ID<input value={draft.external_account_id} onChange={(e) => setDraft({ ...draft, external_account_id: e.target.value })} /></label>
        <label>Access token<input value={draft.token} onChange={(e) => setDraft({ ...draft, token: e.target.value })} placeholder="Use a real token in production" /></label>
        <button className="primary-button full" type="submit"><Link2 size={18} />Connect</button>
      </form>
      <section className="cards-grid compact-grid">
        {(accounts.data || []).map((account) => (
          <article className="platform-card" key={account.id}>
            <Smartphone size={24} /><h2>{account.platform}</h2><span className="status-badge success">Connected</span>
            <p>{account.account_name || account.external_account_id || "AutoLink account"}</p>
            <button className="secondary-button" type="button" onClick={() => disconnect(account.id)}>Disconnect</button>
          </article>
        ))}
      </section>
    </section>
  );
}

function ReportsPage() {
  const summary = useApiState(async () => (await api.get("/reports/summary/")).data, []);
  const activity = useApiState(async () => (await api.get("/reports/activity/")).data, []);
  return (
    <section className="two-column">
      <article className="wide-panel">
        <h2>Performance summary</h2>
        <div className="report-lines">
          {Object.entries(summary.data || {}).map(([label, value]) => <div key={label}><span>{label.replaceAll("_", " ")}</span><strong>{value}</strong></div>)}
        </div>
      </article>
      <article className="panel">
        <h2>Recent activity</h2>
        {(activity.data || []).map((item) => <button className="action-row" key={item.id}><CheckCircle2 size={18} />{item.action}</button>)}
        {!activity.loading && !activity.data?.length && <p className="muted">No report activity yet.</p>}
      </article>
    </section>
  );
}

function SubscriptionPage() {
  const subscription = useApiState(async () => (await api.get("/subscription/status/")).data, []);
  async function upgrade(plan) {
    await api.post("/subscription/upgrade/", { plan, days: 30 });
    subscription.reload();
  }
  return (
    <section className="cards-grid">
      {["free", "premium", "business"].map((plan, index) => (
        <article className={`price-card ${subscription.data?.plan === plan ? "featured" : ""}`} key={plan}>
          <h2>{plan}</h2>
          <strong>{["KES 0", "KES 799", "KES 1999"][index]}</strong>
          <p>{["Starter automations", "Advanced automation and reports", "Team workflows and priority support"][index]}</p>
          <button className={subscription.data?.plan === plan ? "secondary-button" : "primary-button full"} type="button" onClick={() => upgrade(plan)}>
            <CreditCard size={18} />{subscription.data?.plan === plan ? "Current" : "Upgrade"}
          </button>
        </article>
      ))}
    </section>
  );
}

function ProfilePage() {
  const profile = useApiState(async () => (await api.get("/user/profile/")).data, []);
  const [form, setForm] = useState({ username: "", full_name: "", phone_number: "" });
  useEffect(() => {
    if (profile.data) setForm({ username: profile.data.username || "", full_name: profile.data.full_name || "", phone_number: profile.data.phone_number || "" });
  }, [profile.data]);

  async function save() {
    await api.put("/user/update/", form);
    profile.reload();
  }

  return (
    <section className="two-column">
      <article className="panel">
        <h2>Profile</h2>
        <label>Full name<input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></label>
        <label>Username<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>
        <label>Email<input value={profile.data?.email || ""} disabled /></label>
        <label>Phone<input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} /></label>
        <button className="primary-button full" type="button" onClick={save}><Settings size={18} />Save changes</button>
      </article>
      <article className="wide-panel"><h2>Security</h2><div className="security-list"><span>JWT sessions enabled</span><span>Route protection active</span><span>Logout clears local token</span></div></article>
    </section>
  );
}

function ProtectedApp() {
  const [token, setToken] = useState(localStorage.getItem("autolink_token"));
  const authed = useMemo(() => Boolean(token), [token]);

  function handleAuth(access, refresh) {
    localStorage.setItem("autolink_token", access);
    if (refresh) localStorage.setItem("autolink_refresh", refresh);
    setAuthToken(access);
    setToken(access);
  }

  function logout() {
    localStorage.removeItem("autolink_token");
    localStorage.removeItem("autolink_refresh");
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
  <React.StrictMode><BrowserRouter><ProtectedApp /></BrowserRouter></React.StrictMode>
);
