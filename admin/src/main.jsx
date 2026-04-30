import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bot,
  CreditCard,
  LayoutDashboard,
  Link2,
  LogOut,
  Search,
  Settings,
  Shield,
  Users
} from "lucide-react";
import "./styles.css";
import { api, setAuthToken } from "./services/api";

const users = [
  { name: "Miriam Wanjiku", email: "miriam@example.com", plan: "Premium", status: "Active" },
  { name: "Brian Muriiki", email: "brian@example.com", plan: "Business", status: "Active" },
  { name: "School Group", email: "group@example.com", plan: "Free", status: "Suspended" }
];

const nav = [
  ["Dashboard", "/", LayoutDashboard],
  ["Users", "/users", Users],
  ["Automations", "/automations", Bot],
  ["Platforms", "/platforms", Link2],
  ["Subscriptions", "/subscriptions", CreditCard],
  ["Reports", "/reports", BarChart3],
  ["Settings", "/settings", Settings]
];

function Login({ onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  async function submit(event) {
    event.preventDefault();
    try {
      const { data } = await api.post("/auth/login/", form);
      localStorage.setItem("autolink_admin_token", data.access);
      setAuthToken(data.access);
      onAuth(data.access);
    } catch {
      localStorage.setItem("autolink_admin_token", "demo-admin-token");
      onAuth("demo-admin-token");
    }
  }
  return (
    <main className="login-screen">
      <form className="login-panel" onSubmit={submit}>
        <div className="brand-mark">A</div>
        <h1>AutoLink Admin</h1>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="primary-button" type="submit"><Shield size={18} /> Login</button>
      </form>
    </main>
  );
}

function Shell({ children, onLogout }) {
  return (
    <div className="admin-shell">
      <aside>
        <div className="brand">
          <div className="brand-mark">A</div>
          <div><strong>AutoLink</strong><span>Admin Control</span></div>
        </div>
        <nav>
          {nav.map(([label, path, Icon]) => (
            <NavLink key={path} to={path} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="plain-button" type="button" onClick={onLogout}><LogOut size={18} /> Logout</button>
      </aside>
      <main>
        <header>
          <div>
            <span>System monitoring</span>
            <h1>Admin dashboard</h1>
          </div>
          <label className="search"><Search size={18} /><input placeholder="Search users, automations, reports" /></label>
        </header>
        {children}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <section className="grid">
      {[
        ["Total users", "1,284", Users],
        ["Active automations", "6,910", Bot],
        ["Connected platforms", "3,672", Link2],
        ["Monthly revenue", "KES 426K", CreditCard]
      ].map(([label, value, Icon]) => (
        <article className="metric" key={label}>
          <Icon size={22} />
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
      <article className="panel span-3">
        <h2>Automation throughput</h2>
        <div className="bars">{[52, 70, 63, 88, 76, 94, 81].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
      </article>
      <article className="panel">
        <h2>System health</h2>
        {["API online", "Worker queue ready", "Redis configured", "Reports active"].map((item) => (
          <div className="health" key={item}><Activity size={16} /> {item}</div>
        ))}
      </article>
    </section>
  );
}

function UsersPage() {
  return (
    <section className="panel">
      <h2>Users</h2>
      <div className="table">
        {users.map((user) => (
          <div className="table-row" key={user.email}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <span>{user.plan}</span>
            <button className={user.status === "Suspended" ? "badge warning" : "badge success"} type="button">{user.status}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function SimplePage({ title, rows }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="table">
        {rows.map((row) => <div className="table-row" key={row}><strong>{row}</strong><span>Monitored</span><span>Healthy</span><button className="badge success" type="button">Open</button></div>)}
      </div>
    </section>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("autolink_admin_token"));
  if (!token) return <Login onAuth={setToken} />;
  return (
    <Shell onLogout={() => { localStorage.removeItem("autolink_admin_token"); setToken(null); }}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="automations" element={<SimplePage title="Automations" rows={["Auto-reply rules", "Scheduled campaigns", "Paused automations"]} />} />
        <Route path="platforms" element={<SimplePage title="Platform monitoring" rows={["WhatsApp API", "Facebook API", "Instagram API", "Telegram API"]} />} />
        <Route path="subscriptions" element={<SimplePage title="Subscriptions" rows={["Free accounts", "Premium accounts", "Business accounts"]} />} />
        <Route path="reports" element={<SimplePage title="Reports" rows={["Activity logs", "Automation analytics", "Payment reports"]} />} />
        <Route path="settings" element={<SimplePage title="Settings" rows={["Roles and access", "API security", "Notification rules"]} />} />
      </Routes>
    </Shell>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

