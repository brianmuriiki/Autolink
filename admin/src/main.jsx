import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Activity, BarChart3, Bot, CreditCard, LayoutDashboard, Link2, LogOut, Search, Settings, Shield, Users } from "lucide-react";
import "./styles.css";
import { api, setAuthToken } from "./services/api";

const nav = [
  ["Dashboard", "/", LayoutDashboard],
  ["Users", "/users", Users],
  ["Automations", "/automations", Bot],
  ["Platforms", "/platforms", Link2],
  ["Subscriptions", "/subscriptions", CreditCard],
  ["Reports", "/reports", BarChart3],
  ["Settings", "/settings", Settings]
];

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

  return { data, loading, error, reload };
}

function Login({ onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login/", form);
      localStorage.setItem("autolink_admin_token", data.access);
      localStorage.setItem("autolink_admin_refresh", data.refresh);
      setAuthToken(data.access);
      onAuth(data.access);
    } catch (err) {
      setError(JSON.stringify(err.response?.data || "Admin login failed."));
    }
  }

  return (
    <main className="login-screen">
      <form className="login-panel" onSubmit={submit}>
        <div className="brand-mark">A</div>
        <h1>AutoLink Admin</h1>
        {error && <p className="form-error">{error}</p>}
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="primary-button" type="submit"><Shield size={18} />Login</button>
      </form>
    </main>
  );
}

function Shell({ children, onLogout }) {
  return (
    <div className="admin-shell">
      <aside>
        <div className="brand"><div className="brand-mark">A</div><div><strong>AutoLink</strong><span>Admin Control</span></div></div>
        <nav>{nav.map(([label, path, Icon]) => <NavLink key={path} to={path} className={({ isActive }) => (isActive ? "active" : "")}><Icon size={18} />{label}</NavLink>)}</nav>
        <button className="plain-button" type="button" onClick={onLogout}><LogOut size={18} />Logout</button>
      </aside>
      <main>
        <header>
          <div><span>System monitoring</span><h1>Admin dashboard</h1></div>
          <label className="search"><Search size={18} /><input placeholder="Search users, automations, reports" /></label>
        </header>
        {children}
      </main>
    </div>
  );
}

function Dashboard() {
  const dashboard = useApiState(async () => (await api.get("/admin/dashboard/")).data, []);
  const stats = [
    ["Total users", dashboard.data?.users || 0, Users],
    ["Active automations", dashboard.data?.active_automations || 0, Bot],
    ["Total subscriptions", dashboard.data?.subscriptions || 0, CreditCard],
    ["Reports", dashboard.data?.reports || 0, BarChart3]
  ];
  return (
    <section className="grid">
      {stats.map(([label, value, Icon]) => <article className="metric" key={label}><Icon size={22} /><span>{label}</span><strong>{value}</strong></article>)}
      <article className="panel span-3">
        <h2>Automation throughput</h2>
        <div className="bars">{[52, 70, 63, 88, 76, 94, 81].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
      </article>
      <article className="panel"><h2>System health</h2>{["API online", "JWT protected", "Reports active", "Admin API connected"].map((item) => <div className="health" key={item}><Activity size={16} />{item}</div>)}</article>
    </section>
  );
}

function UsersPage() {
  const users = useApiState(async () => (await api.get("/admin/users/")).data, []);
  async function suspend(user) {
    await api.put("/admin/users/suspend/", { user_id: user.id, is_suspended: !user.is_suspended });
    users.reload();
  }
  return (
    <section className="panel">
      <h2>Users</h2>
      <div className="table">
        {(users.data || []).map((user) => (
          <div className="table-row" key={user.id}>
            <strong>{user.full_name || user.email}</strong><span>{user.email}</span><span>{user.is_suspended ? "Suspended" : "Active"}</span>
            <button className={user.is_suspended ? "badge warning" : "badge success"} type="button" onClick={() => suspend(user)}>{user.is_suspended ? "Unsuspend" : "Suspend"}</button>
          </div>
        ))}
        {users.loading && <div className="table-row"><strong>Loading users...</strong></div>}
      </div>
    </section>
  );
}

function AutomationsPage() {
  const automations = useApiState(async () => (await api.get("/admin/automations/")).data, []);
  return <DataTable title="Automations" rows={(automations.data || []).map((item) => [item.type, item.message, item.is_active ? "Active" : "Paused"])} loading={automations.loading} />;
}

function ReportsPage() {
  const reports = useApiState(async () => (await api.get("/admin/reports/")).data, []);
  return <DataTable title="Reports" rows={(reports.data || []).map((item) => [item.action, new Date(item.timestamp).toLocaleString(), JSON.stringify(item.details)])} loading={reports.loading} />;
}

function DataTable({ title, rows, loading }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="table">
        {loading && <div className="table-row"><strong>Loading...</strong></div>}
        {rows.map((row, index) => <div className="table-row" key={`${title}-${index}`}><strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><button className="badge success" type="button">Open</button></div>)}
        {!loading && rows.length === 0 && <div className="table-row"><strong>No records yet.</strong></div>}
      </div>
    </section>
  );
}

function SimplePage({ title, rows }) {
  return <DataTable title={title} rows={rows.map((row) => [row, "Configured through backend services", "Ready"])} loading={false} />;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("autolink_admin_token"));
  if (!token) return <Login onAuth={setToken} />;
  return (
    <Shell onLogout={() => { localStorage.removeItem("autolink_admin_token"); localStorage.removeItem("autolink_admin_refresh"); setAuthToken(null); setToken(null); }}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="automations" element={<AutomationsPage />} />
        <Route path="platforms" element={<SimplePage title="Platform monitoring" rows={["WhatsApp API", "Facebook API", "Instagram API", "Telegram API"]} />} />
        <Route path="subscriptions" element={<SimplePage title="Subscriptions" rows={["Free accounts", "Premium accounts", "Business accounts"]} />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SimplePage title="Settings" rows={["Roles and access", "API security", "Notification rules"]} />} />
      </Routes>
    </Shell>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);
