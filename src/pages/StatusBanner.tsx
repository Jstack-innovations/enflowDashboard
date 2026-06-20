import { ArrowUpRight, AlertTriangle, XCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type AccountStatus = "trial" | "expired" | "cancelled" | "active";

interface StatusBannerProps {
  status: AccountStatus;
  plan?: string;
  trialEndsAt?: string;
  renewalDate?: string;
  softwareUrl?: string;  
}

function daysUntil(dateStr?: string): number {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const configs = {
  trial: {
    icon: Clock,
    iconColor: "#d6a86a",
    bg: "linear-gradient(135deg, rgba(214,168,106,0.08) 0%, rgba(214,168,106,0.03) 100%)",
    border: "rgba(214,168,106,0.22)",
    pill: { bg: "rgba(214,168,106,0.15)", color: "#d6a86a", text: "Trial" },
    cta: "Upgrade now",
  },
  expired: {
    icon: AlertTriangle,
    iconColor: "#f87171",
    bg: "linear-gradient(135deg, rgba(248,113,113,0.08) 0%, rgba(248,113,113,0.03) 100%)",
    border: "rgba(248,113,113,0.22)",
    pill: { bg: "rgba(248,113,113,0.12)", color: "#f87171", text: "Expired" },
    cta: "Renew now",
  },
  cancelled: {
    icon: XCircle,
    iconColor: "#94a3b8",
    bg: "linear-gradient(135deg, rgba(148,163,184,0.07) 0%, rgba(148,163,184,0.02) 100%)",
    border: "rgba(148,163,184,0.18)",
    pill: { bg: "rgba(148,163,184,0.12)", color: "#94a3b8", text: "Cancelled" },
    cta: "Reactivate",
  },
  active: {
    icon: CheckCircle2,
    iconColor: "#4ade80",
    bg: "linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(74,222,128,0.02) 100%)",
    border: "rgba(74,222,128,0.18)",
    pill: { bg: "rgba(74,222,128,0.12)", color: "#4ade80", text: "Active" },
    cta: "Manage plan",
  },
};

function getBannerContent(status: AccountStatus, plan?: string, trialEndsAt?: string, renewalDate?: string) {
  const daysLeft = daysUntil(trialEndsAt);

  switch (status) {
    case "trial":
      return {
        headline: daysLeft <= 3
          ? `Your trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`
          : `${daysLeft} days left on your trial`,
        sub: "Upgrade to keep your ZaraAI automations, analytics, and full dashboard access.",
        meta: trialEndsAt ? `Trial ends ${formatDate(trialEndsAt)}` : null,
      };
    case "expired":
      return {
        headline: "Your subscription has expired",
        sub: "Renew to restore full access. Your data is intact and waiting.",
        meta: renewalDate ? `Was due ${formatDate(renewalDate)}` : null,
      };
    case "cancelled":
      return {
        headline: "Subscription cancelled",
        sub: "Reactivate anytime to pick up where you left off. No setup required.",
        meta: null,
      };
    case "active":
      return {
        headline: `You're on ${plan ?? "a paid plan"}`,
        sub: "All features active. ZaraAI is live and your business is covered.",
        meta: renewalDate ? `Renews ${formatDate(renewalDate)}` : null,
      };
  }
}

  export function StatusBanner({ status, plan, trialEndsAt, renewalDate, softwareUrl }: StatusBannerProps) {
    
  // Don't show banner for active plans — optional, remove if you always want it
  // if (status === "active") return null;

  const cfg = configs[status];
  const { headline, sub, meta } = getBannerContent(status, plan, trialEndsAt, renewalDate);
  const Icon = cfg.icon;

  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${cfg.border}`,
        background: cfg.bg,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: `${cfg.iconColor}18`,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 18, height: 18, color: cfg.iconColor }} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-foreground)" }}>
            {headline}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              padding: "2px 8px",
              borderRadius: 100,
              background: cfg.pill.bg,
              color: cfg.pill.color,
            }}
          >
            {cfg.pill.text}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "var(--color-muted-foreground)", lineHeight: 1.5 }}>
          {sub}
          {meta && (
            <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 11 }}>· {meta}</span>
          )}
        </p>
      </div>

      {/* CTA */}
{status === "cancelled" ? (
  <a
    href="mailto:hello@getenflowai.online?subject=Reactivate%20My%20Account"
    style={{ flexShrink: 0 }}
  >
    <Button size="sm" variant="outline" className="gap-1.5" style={{ fontSize: 12 }}>
      {cfg.cta} <ArrowUpRight style={{ width: 14, height: 14 }} />
    </Button>
  </a>
  
  ) : status === "active" ? (
  <a href={softwareUrl ?? "#"} style={{ flexShrink: 0 }}>
    <Button
      size="sm"
      variant="outline"
      className="gap-1.5"
      style={{ fontSize: 12 }}
    >
      {cfg.cta} <ArrowUpRight style={{ width: 14, height: 14 }} />
    </Button>
  </a>
  
) : (
  // trial + expired both go to plans page
  <a href="https://plans.getenflowai.online" style={{ flexShrink: 0 }}>
    <Button
      size="sm"
      style={{ background: cfg.iconColor, color: "#0c0602", fontWeight: 700, fontSize: 12, letterSpacing: 0.5, border: "none" }}
      className="gap-1.5"
    >
      {cfg.cta} <ArrowUpRight style={{ width: 14, height: 14 }} />
    </Button>
  </a>
)}
    </div>
  );
}

