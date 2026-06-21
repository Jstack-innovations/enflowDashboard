import { useState, useEffect } from "react";
import { ENFLOW_API } from "../Config/enflowApi";
import styles from "./Home.module.css";
import {
  Bell, Search, Plus, ChevronRight, TrendingUp, TrendingDown,
  ShoppingBag, Users, Utensils, Sparkles, MessageSquare,
  LayoutDashboard, ClipboardList, BookOpen, BarChart3, Bot,
  UserCog, Settings, LogOut, Circle, MoreHorizontal, ArrowUpRight,
  Globe, Instagram, Phone, Truck,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import ZaraLogo from "../assets/ZaraLogo.png";
import { StatusBanner } from "./StatusBanner";


const statusTone: Record<string, string> = {
  "Preparing": "bg-accent/20 text-accent-foreground border-accent/30",
  "Out for delivery": "bg-chart-3/15 text-chart-3 border-chart-3/30",
  "Served": "bg-primary/10 text-primary border-primary/20",
  "Paid": "bg-muted text-muted-foreground border-border",
};

const shimmer: React.CSSProperties = {
  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
  animation: "home-shimmer 1.4s infinite",
  borderRadius: "inherit",
};

function Skeleton({ w, h, radius = 8 }: { w: string | number; h: number; radius?: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: radius, background: "rgba(255,255,255,0.06)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
      <div style={shimmer} />
    </div>
  );
}

function getServicePeriod(): string {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 11) return "Morning service";
  if (hour >= 11 && hour < 15) return "Lunch service";
  if (hour >= 15 && hour < 18) return "Afternoon service";
  if (hour >= 18 && hour < 23) return "Dinner service";
  return "Late night";
}

function getLiveDate(): string {
  return new Date().toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long",
  });
}

export default function Home() {
  const [navOpen, setNavOpen]     = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [checking, setChecking]   = useState(true);
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("enflow_token");
    if (!token) { window.location.href = "/login"; return; }

    fetch(`${ENFLOW_API}/dashboard`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(async r => {
        const data = await r.json();
        if (data.status === "ok") {
          setDashboard(data.dashboard);
          setChecking(false);
} else {
  localStorage.removeItem("enflow_token");
  localStorage.removeItem("enflow_user");
  localStorage.removeItem("enflow_token_expiry");
  if (data.message?.toLowerCase().includes("suspended")) {
    setChecking(false);
    setSuspended(true);
  } else {
    sessionStorage.setItem("auth_message", data.message ?? "Session ended. Please log in again.");
    window.location.href = "/login";
  }
}
      })
      .catch(() => { window.location.href = "/login"; });
  }, []);
  
  
  const revenueData = dashboard?.stats?.daily_revenue ?? [];
const recentOrders = dashboard?.stats?.recent_orders ?? [];

if (suspended) return (
  <div style={{ background: "#080502", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, sans-serif" }}>
    <div style={{ background: "rgba(255,238,215,0.02)", border: "1px solid rgba(214,168,106,0.15)", borderRadius: 16, padding: "36px 28px", maxWidth: 400, width: "100%", textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
      <h2 style={{ color: "#ffffff", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Account Suspended</h2>
      <p style={{ color: "#aaaaaa", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
        Your account has been suspended. Please contact support to resolve this.
      </p>
      <a href="mailto:hello@getenflowai.online" style={{ display: "inline-block", background: "linear-gradient(135deg, #d6a86a, #b8864a)", color: "#0c0602", padding: "12px 28px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none" }}>
        Contact Support
      </a>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => { window.location.href = "/login"; }} style={{ background: "none", border: "none", color: "#666", fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
          ← Back to login
        </button>
      </div>
    </div>
  </div>
);

  if (checking) return (
<div className={styles.layout}>
      <style>{`
        @keyframes home-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <aside className={`${styles.sidebar}`}>
        <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="h-9 w-9 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-bold text-lg">E</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Skeleton w="80%" h={14} />
            <div style={{ marginTop: 6 }}><Skeleton w="60%" h={10} /></div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[1,2,3,4,5,6,7].map(n => <Skeleton key={n} w="100%" h={36} radius={8} />)}
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.searchBar}><Skeleton w="100%" h={36} radius={8} /></div>
          <div className={styles.topbarRight}>
            <Skeleton w={36} h={36} radius={18} />
            <Skeleton w={32} h={32} radius={16} />
          </div>
        </header>
        <main className={styles.content}>
          <div className={styles.hero}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Skeleton w={120} h={12} />
              <Skeleton w={220} h={24} radius={6} />
              <Skeleton w={180} h={12} />
            </div>
          </div>

          <div className={styles.statsGrid}>
            {[1,2,3,4].map(n => <Skeleton key={n} w="100%" h={100} radius={16} />)}
          </div>
          <div className={styles.chartGrid}>
            <Skeleton w="100%" h={280} radius={16} />
            <Skeleton w="100%" h={280} radius={16} />
          </div>
          <div className={styles.ordersGrid}>
            <Skeleton w="100%" h={320} radius={16} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Skeleton w="100%" h={200} radius={16} />
              <Skeleton w="100%" h={200} radius={16} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes home-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className={styles.layout}>
        {navOpen && <div className={styles.overlay} onClick={() => setNavOpen(false)} />}

        <aside className={`${styles.sidebar} ${navOpen ? styles.sidebarOpen : ""}`}>
          <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="h-9 w-9 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-bold text-lg">E</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {checking
                ? <><Skeleton w="80%" h={14} /><div style={{ marginTop: 6 }}><Skeleton w="60%" h={10} /></div></>
                : <>
                    <div className="font-semibold">{dashboard?.business?.name ?? "Enflow"}</div>
                    <div style={{ fontSize: 11 }} className="text-sidebar-foreground/50">{dashboard?.business?.type ?? "Business"}</div>
                  </>
              }
            </div>
          </div>

          <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { icon: LayoutDashboard, label: "Overview", active: true },
              { icon: ClipboardList, label: "Orders", badge: "12" },
              { icon: BookOpen, label: "Menu" },
              { icon: BarChart3, label: "Analytics" },
              { icon: Bot, label: "ZaraAI", badge: "AI" },
              { icon: UserCog, label: "Team" },
              { icon: Settings, label: "Settings" },
            ].map((it) => (
              <a key={it.label} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                it.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}>
                <it.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    it.badge === "AI" ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-sidebar-foreground/15"
                  }`}>{it.badge}</span>
                )}
              </a>
            ))}
          </nav>

          <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="rounded-xl bg-sidebar-accent p-3 text-xs mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles style={{ width: 14, height: 14 }} className="text-sidebar-primary" />
                <span className="font-semibold">ZaraAI Pro</span>
              </div>
              <p className="text-sidebar-foreground/60 mb-3">Upgrade for Pidgin voice orders & WhatsApp automations.</p>
              <Button size="sm" className="w-full h-8 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 text-xs">
                Upgrade plan
              </Button>
            </div>
            <button
              onClick={async () => {
  const token = localStorage.getItem("enflow_token");
  if (token) {
    await fetch(`${ENFLOW_API}/logout`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
    }).catch(() => {});
  }
  localStorage.removeItem("enflow_token");
  localStorage.removeItem("enflow_user");
  localStorage.removeItem("enflow_token_expiry");
  window.location.href = "/login";
}}
              className="flex items-center gap-2 px-3 py-2 w-full text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground rounded-lg hover:bg-sidebar-accent/50"
            >
              <LogOut style={{ width: 16, height: 16 }} /> Log out
            </button>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <button className={styles.menuBtn} onClick={() => setNavOpen(true)}>
              <MoreHorizontal style={{ width: 20, height: 20 }} />
            </button>
            <div className={styles.searchBar} style={{ position: "relative" }}>
              <Search style={{ width: 16, height: 16, position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} className="text-muted-foreground" />
              <Input placeholder="Search…" className="pl-9 h-9 bg-secondary border-transparent text-sm w-full" />
            </div>
            <div className={styles.topbarRight}>
              <Button size="icon" variant="ghost" style={{ position: "relative", width: 36, height: 36 }}>
                <Bell style={{ width: 18, height: 18 }} />
                <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%" }} className="bg-accent" />
              </Button>
              <Avatar className="h-8 w-8">
                {checking
                  ? <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}><div style={shimmer} /></div>
                  : <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {dashboard?.account?.fullname?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() ?? "EN"}
                    </AvatarFallback>
                }
              </Avatar>
            </div>
          </header>

          <main className={styles.content}>
            <div className={styles.hero}>
  <div>
    <p className="text-xs text-muted-foreground">{getLiveDate()} · {getServicePeriod()}</p>
    {checking
      ? <div style={{ marginTop: 6 }}><Skeleton w="60%" h={22} radius={6} /></div>
      : <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>Greetings, {dashboard?.account?.fullname ?? "there"}</h1>
    }
    {(() => {
      const data = dashboard?.stats?.daily_revenue ?? [];
      if (data.length < 2) return (
        <p className="text-sm text-muted-foreground" style={{ marginTop: 4 }}>
          No comparison data yet. Check back tomorrow.
        </p>
      );
      const today = data[data.length - 1]?.revenue ?? 0;
      const yesterday = data[data.length - 2]?.revenue ?? 0;
      const pct = yesterday === 0 ? null : Math.round(((today - yesterday) / yesterday) * 100);
      const up = pct !== null && pct >= 0;
      return (
        <p className="text-sm text-muted-foreground" style={{ marginTop: 4 }}>
          {pct === null ? "No comparison data yet." : <>
            You're trending{" "}
            <span className={up ? "text-primary font-medium" : "text-destructive font-medium"}>
              {up ? "+" : ""}{pct}%
            </span>{" "}
            vs yesterday. {up ? "Kitchen is on it." : "Let's push through."}
          </>}
        </p>
      );
    })()}
  </div>
              <div className={styles.heroActions}>
<Button variant="outline" size="sm" className="gap-1.5">
  <img src={ZaraLogo} alt="Zara" style={{ width: 16, height: 16, objectFit: "contain" }} /> Ask ZaraAI
</Button>
                <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
                  <Plus style={{ width: 16, height: 16 }} /> New order
                </Button>
              </div>
            </div>
            
            
{dashboard && (
 <StatusBanner
  status={dashboard.account.status}
  plan={dashboard.account.plan}
  trialEndsAt={dashboard.account.trial_ends_at}
  renewalDate={dashboard.account.renewal_date}
  softwareUrl={dashboard.business.software_url}
/>
)}

            <div className={styles.statsGrid}>
<StatCard 
  icon={TrendingUp} 
  label="Revenue today" 
  value={dashboard?.stats ? `₦${Number(dashboard.stats.revenue_today).toLocaleString()}` : "₦0"} 
  delta="" 
  trend="flat" 
  tint="primary" 
/>
<StatCard 
  icon={ShoppingBag} 
  label="Orders" 
  value={dashboard?.stats ? String(dashboard.stats.orders_today) : "0"} 
  delta="" 
  trend="flat" 
  tint="accent" 
/>
<StatCard 
  icon={Utensils} 
  label="Tables seated" 
  value={dashboard?.stats ? `${dashboard.stats.tables_seated} / ${dashboard.stats.tables_total}` : "0 / 0"} 
  delta="" 
  trend="flat" 
  tint="chart3" 
/>
<StatCard 
  icon={MessageSquare} 
  label="Zara credits used" 
  value={dashboard?.zara ? `${dashboard.zara.credits_used} / ${dashboard.zara.credits}` : "0 / 0"} 
  delta="" 
  trend="flat" 
  tint="muted" 
/>
            </div>

            <div className={styles.chartGrid}>
              <div className="rounded-2xl bg-card border border-border p-5">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <h2 className="font-semibold">Revenue this week</h2>
                    <p className="text-xs text-muted-foreground" style={{ marginTop: 2 }}>Closed orders · all channels</p>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["7D", "30D", "90D"].map((p, i) => (
                      <button key={p} className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                        i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                      }`}>{p}</button>
                    ))}
                  </div>
                </div>
                <div style={{ height: 208 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ left: -10, right: 0, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
<XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
<YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v / 1000}k`} />
<Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} />
<Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#rev)" />               </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
<div className="h-9 w-9 rounded-xl bg-accent text-accent-foreground grid place-items-center overflow-hidden">
  <img src={ZaraLogo} alt="Zara" style={{ width: 28, height: 28, objectFit: "contain" }} />
</div>
                    <div>
                      <div className="font-semibold">ZaraAI</div>
                      <div style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }} className="text-primary-foreground/70">
                        <Circle style={{ width: 6, height: 6 }} className="fill-accent text-accent" /> Live · Pidgin
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-primary-foreground/15 text-primary-foreground border-0 text-[11px]">
                    {checking ? "..." : dashboard?.account?.plan || "Trial"}
                  </Badge>
                </div>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <div className="rounded-xl bg-primary-foreground/10 p-3 text-sm">
                    <p style={{ fontSize: 11 }} className="text-primary-foreground/60 mb-1">Customer · WhatsApp</p>
                    "Abeg, una still get jollof + turkey for two?"
                  </div>
                  <div className="rounded-xl bg-accent text-accent-foreground p-3 text-sm">
                    <p style={{ fontSize: 11 }} className="opacity-60 mb-1">Zara replied</p>
                    "Yes o! ₦9,200 for two. I fit place am for you now?"
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }} className="text-primary-foreground/70">
                    <span>Zara credits left</span>
                    <span className="font-semibold text-primary-foreground">
                      {checking ? "..." : dashboard?.zara?.credits_left ?? 0}
                    </span>
                  </div>
                  <Progress value={dashboard ? (dashboard.zara.credits_used / dashboard.zara.credits) * 100 : 0} className="h-1.5 bg-primary-foreground/15" />
                  <Button variant="secondary" size="sm" className="w-full mt-3 bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-1">
                    Open ZaraAI <ArrowUpRight style={{ width: 16, height: 16 }} />
                  </Button>
                </div>
              </div>
            </div>

            <div className={styles.ordersGrid}>
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--color-border)" }}>
                  <div>
                    <h2 className="font-semibold">Recent orders</h2>
                    <p className="text-xs text-muted-foreground" style={{ marginTop: 2 }}>Across all Enflow business operations</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
                    View all <ChevronRight style={{ width: 14, height: 14 }} />
                  </Button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", fontSize: 14, minWidth: 520 }}>
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground bg-secondary/40">
                        <th className="font-medium px-5 py-3">Order</th>
                        <th className="font-medium py-3">Customer</th>
                        <th className="font-medium py-3">Total</th>
                        <th className="font-medium py-3">Status</th>
                        <th className="font-medium py-3 pr-5 text-right">Time</th>
                      </tr>
                    </thead>
 <tbody className="divide-y divide-border">
  {recentOrders.map((o: any) => (
    <tr key={o.id} className="hover:bg-secondary/20 transition-colors">
      <td className="px-5 py-3 font-medium text-xs">#{o.plate_no ?? o.id}</td>
<td className="py-3">
        <div className="font-medium text-sm">{o.name ?? "Guest"}</div>
        <div className="text-muted-foreground" style={{ fontSize: 11 }}>{o.order_type}</div>
      </td>
      <td className="py-3 font-semibold text-sm">₦{Number(o.total_amount).toLocaleString()}</td>
      <td className="py-3">
        <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${statusTone[o.order_status] ?? "bg-muted text-muted-foreground border-border"}`}>
          <Circle style={{ width: 6, height: 6 }} className="fill-current" />{o.order_status}
        </span>
      </td>
      <td className="py-3 pr-5 text-right text-muted-foreground text-xs">
        {new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </td>
    </tr>
  ))}
</tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="rounded-2xl bg-card border border-border p-5">
                  <h3 className="font-semibold text-sm">Top items today</h3>
{(dashboard?.stats?.top_items ?? []).length === 0 ? (
                    <div style={{ marginTop: 16, textAlign: "center", padding: "20px 0" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>🍽️</div>
                      <p style={{ fontSize: 13, fontWeight: 500 }} className="text-muted-foreground">No items sold today yet.</p>
                      <p style={{ fontSize: 11, marginTop: 4, lineHeight: 1.6 }} className="text-muted-foreground">
                        Visit your Enflow business operations to see live updates.
                      </p>
                    </div>
                  ) : (
                    <ul style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                      {(dashboard?.stats?.top_items ?? []).map((i: any) => (
                        <li key={i.name}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                            <span>{i.name}</span>
                            <span className="text-muted-foreground text-xs">{i.qty} sold</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 999, overflow: "hidden" }} className="bg-secondary">
                            <div style={{ width: `${i.pct}%`, height: "100%" }} className="bg-primary" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl bg-card border border-border p-5">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 className="font-semibold text-sm">Channels online</h3>
                    <span className="text-primary flex items-center gap-1" style={{ fontSize: 11 }}>
                      <Circle style={{ width: 6, height: 6 }} className="fill-current" /> All good
                    </span>
                  </div>
                  {checking ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[1,2,3,4].map(n => <Skeleton key={n} w="100%" h={40} radius={12} />)}
                    </div>
                  ) : (
                    <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        ...(dashboard?.connected_tools?.whatsapp ? [{ icon: Phone, label: "WhatsApp" }] : []),
                        ...(dashboard?.connected_tools?.social?.includes("instagram") ? [{ icon: Instagram, label: "Instagram" }] : []),
                        ...(dashboard?.connected_tools?.delivery?.includes("chowdeck") ? [{ icon: Truck, label: "Chowdeck" }] : []),
                        ...(dashboard?.business?.website ? [{ icon: Globe, label: "Website" }] : []),
                      ].map((c) => (
                        <li key={c.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12 }} className="bg-secondary/60">
                          <c.icon style={{ width: 16, height: 16, flexShrink: 0 }} className="text-primary" />
                          <span style={{ flex: 1, fontSize: 13 }}>{c.label}</span>
                          <Circle style={{ width: 8, height: 8, flexShrink: 0 }} className="fill-primary text-primary" />
                        </li>
                      ))}
                    </ul>
                  )}
                  <Separator style={{ margin: "16px 0" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Users style={{ width: 14, height: 14, flexShrink: 0 }} className="text-muted-foreground" />
                    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }} className="text-muted-foreground">
                      Team · {dashboard?.team?.length ?? 0} members
                    </span>
                  </div>
                  {checking ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[1,2,3].map(n => <Skeleton key={n} w="100%" h={40} radius={10} />)}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {(dashboard?.team ?? []).map((m: any) => (
                        <div key={m.email} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 10 }} className="bg-secondary/40">
                          <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700 }} className="bg-primary/15 text-primary">
                            {m.email.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.email}</div>
                            <div style={{ fontSize: 10, textTransform: "capitalize", letterSpacing: 0.5 }} className="text-muted-foreground">{m.role.replace("_", " ")}</div>
                          </div>
                          <Circle style={{ width: 7, height: 7, flexShrink: 0 }} className="fill-primary text-primary" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, delta, trend, tint }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; delta: string;
  trend: "up" | "down" | "flat";
  tint: "primary" | "accent" | "chart3" | "muted";
}) {
  const tints: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/25 text-accent-foreground",
    chart3: "bg-chart-3/15 text-chart-3",
    muted: "bg-secondary text-muted-foreground",
  };
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp;
  const trendColor = trend === "up" ? "text-primary" : trend === "down" ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="rounded-2xl bg-card border border-border" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className={`h-9 w-9 rounded-xl grid place-items-center ${tints[tint]}`}>
          <Icon style={{ width: 18, height: 18 }} />
        </div>
        <span className={`text-xs flex items-center gap-0.5 font-medium ${trendColor}`}>
          {trend !== "flat" && <TrendIcon style={{ width: 12, height: 12 }} />}{delta}
        </span>
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
        <div className="text-xs text-muted-foreground" style={{ marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
  }
