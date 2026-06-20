import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENFLOW_API } from "../Config/enflowApi";
import { Eye, EyeOff } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

const shimmerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "40px",
  height: "100%",
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
  animation: "enflow-shimmer 2.5s infinite",
  pointerEvents: "none",
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus]           = useState<FormState>("idle");
  const [message, setMessage]         = useState("");
  
  useEffect(() => {
    const m = sessionStorage.getItem("auth_message");
    if (m) {
      sessionStorage.removeItem("auth_message");
      setMessage(m);
      setStatus("error");
    }
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setStatus("error");
      setMessage("Please enter your email and password.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(`${ENFLOW_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        localStorage.setItem("enflow_token", data.token);
        localStorage.setItem("enflow_user", JSON.stringify(data.user));
        localStorage.setItem("enflow_token_expiry", data.expires);
        setStatus("success");
        setMessage("Login successful! Taking you to your dashboard...");
        setTimeout(() => navigate("/"), 1200);
      } else {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(214,168,106,0.15)",
    borderRadius: 10,
    padding: "13px 16px",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        @keyframes enflow-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>

      <div style={{
        background: "#080502",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#dddddd",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Brand */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: "inline-block",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#d6a86a",
              border: "1px solid rgba(214,168,106,0.25)",
              borderRadius: 100,
              padding: "5px 14px",
              background: "rgba(214,168,106,0.05)",
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
            }}>
              EnflowAI · Restaurant Intelligence
              <span style={shimmerStyle} />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 300, lineHeight: 1.15, color: "#ffffff", marginBottom: 8 }}>
              Welcome <span style={{ color: "#d6a86a", fontStyle: "italic" }}>back.</span>
            </h1>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6 }}>
              Sign in to your dashboard.
            </p>
          </div>

          {/* Form */}
          <div style={{
            background: "rgba(255,238,215,0.02)",
            border: "1px solid rgba(214,168,106,0.1)",
            borderRadius: 16,
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#666" }}>Email</label>
              <input
                type="email"
                placeholder="you@yourbusiness.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                disabled={status === "loading" || status === "success"}
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#666" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  disabled={status === "loading" || status === "success"}
                  style={{ ...inputStyle, paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword
                    ? <EyeOff style={{ width: 16, height: 16 }} />
                    : <Eye style={{ width: 16, height: 16 }} />
                  }
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div style={{
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                lineHeight: 1.5,
                background: status === "error" ? "rgba(239,68,68,0.08)" : "rgba(214,168,106,0.08)",
                border: `1px solid ${status === "error" ? "rgba(239,68,68,0.25)" : "rgba(214,168,106,0.25)"}`,
                color: status === "error" ? "#f87171" : "#d6a86a",
              }}>
                {status === "success" ? "✓ " : "⚠ "}{message}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={status === "loading" || status === "success"}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 100,
                background: status === "loading" || status === "success"
                  ? "rgba(214,168,106,0.4)"
                  : "linear-gradient(135deg, #d6a86a, #b8864a)",
                border: "none",
                color: "#0c0602",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: status === "loading" || status === "success" ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {status === "loading" ? "Signing in..." : status === "success" ? "✓ Redirecting..." : "Sign In →"}
              {status !== "loading" && status !== "success" && <span style={shimmerStyle} />}
            </button>

            <p style={{ textAlign: "center", fontSize: 11, color: "#555" }}>
              No account?{" "}
<a href="https://plans.getenflowai.online/trial-signup" style={{ color: "#d6a86a", cursor: "pointer", textDecoration: "none" }}>
  Start free trial
</a>
            </p>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#333" }}>
            © 2026 jSTack Innovations · ENFLOW
          </p>
        </div>
      </div>
    </>
  );
}
