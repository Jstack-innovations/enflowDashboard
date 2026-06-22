import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENFLOW_API } from "../Config/enflowApi";
import { Eye, EyeOff } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus]             = useState<FormState>("idle");
  const [message, setMessage]           = useState("");

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

  const isDisabled = status === "loading" || status === "success";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #09080f;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', system-ui, sans-serif;
          color: #e2e2e2;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 960px) {
          .login-root {
            flex-direction: row;
          }
        }

        /* Ambient blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.12;
          pointer-events: none;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: #d6a86a;
          top: -180px; left: -120px;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: #7c5cbf;
          bottom: -150px; right: -100px;
        }
        .blob-3 {
          width: 300px; height: 300px;
          background: #d6a86a;
          bottom: 80px; left: 30%;
          opacity: 0.06;
        }

        /* Left panel */
        .left-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 32px 32px;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 960px) {
          .left-panel {
            justify-content: space-between;
            padding: 48px 56px;
            border-right: 1px solid rgba(255,255,255,0.04);
            min-height: 100vh;
          }
        }

        .left-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
        }

        @media (min-width: 960px) {
          .left-logo { margin-bottom: 0; }
        }

        .left-logo-mark {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #d6a86a, #b8864a);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800; color: #09080f;
          flex-shrink: 0;
        }
        .left-logo-text {
          font-size: 15px; font-weight: 600; color: #fff; letter-spacing: 0.3px;
        }
        .left-logo-sub {
          font-size: 10px; color: #666; letter-spacing: 2px; text-transform: uppercase;
        }

        .left-body {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        @media (min-width: 960px) {
          .left-body { gap: 32px; }
        }

        .left-headline h2 {
          font-size: 32px;
          font-weight: 300;
          line-height: 1.2;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        @media (min-width: 960px) {
          .left-headline h2 { font-size: 38px; }
        }

        .left-headline h2 em {
          font-style: italic;
          color: #d6a86a;
        }
        .left-headline p {
          font-size: 14px;
          color: #666;
          line-height: 1.7;
          max-width: 380px;
        }

        .left-stats {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        @media (min-width: 960px) {
          .left-stats { gap: 32px; }
        }

        .stat-num {
          font-size: 20px;
          font-weight: 700;
          color: #d6a86a;
          letter-spacing: -0.5px;
        }
        .stat-label {
          font-size: 11px;
          color: #555;
          margin-top: 2px;
          letter-spacing: 0.5px;
        }

        .left-bottom-spacer {
          display: none;
        }
        @media (min-width: 960px) {
          .left-bottom-spacer { display: block; height: 1px; }
        }

        /* Divider between panels on mobile */
        .panel-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 0 32px;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 960px) {
          .panel-divider { display: none; }
        }

        /* Right panel */
        .right-panel {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 32px;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 960px) {
          .right-panel {
            max-width: 480px;
            padding: 48px 56px;
            min-height: 100vh;
          }
        }

        .form-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #d6a86a;
          margin-bottom: 12px;
        }
        .form-title {
          font-size: 28px;
          font-weight: 300;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }
        .form-title strong { font-weight: 700; }
        .form-sub {
          font-size: 13px;
          color: #555;
          margin-bottom: 36px;
          line-height: 1.6;
        }

        .field { margin-bottom: 16px; }
        .field-label {
          display: block;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s, background 0.2s;
        }
        .field-input:focus {
          border-color: rgba(214,168,106,0.4);
          background: rgba(214,168,106,0.03);
        }
        .field-input::placeholder { color: #333; }
        .field-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .password-wrap { position: relative; }
        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #444;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .password-toggle:hover { color: #d6a86a; }

        .msg-box {
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .msg-error {
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }
        .msg-success {
          background: rgba(214,168,106,0.06);
          border: 1px solid rgba(214,168,106,0.2);
          color: #d6a86a;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          background: linear-gradient(135deg, #d6a86a, #b8864a);
          border: none;
          color: #09080f;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s, transform 0.15s;
          margin-bottom: 20px;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .form-footer {
          text-align: center;
          font-size: 12px;
          color: #444;
        }
        .form-footer a {
          color: #d6a86a;
          text-decoration: none;
          font-weight: 500;
        }
        .form-footer a:hover { text-decoration: underline; }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.04);
          margin: 24px 0;
        }

        .copyright {
          text-align: center;
          font-size: 11px;
          color: #2a2a2a;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="login-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* Left Panel — always visible */}
        <div className="left-panel">
          <div className="left-logo">
            <div className="left-logo-mark">E</div>
            <div>
              <div className="left-logo-text">Enflow</div>
              <div className="left-logo-sub">by Jstack Innovations</div>
            </div>
          </div>

          <div className="left-body">
            <div className="left-headline">
              <h2>Run your restaurant <em>smarter.</em></h2>
              <p>
                Enflow gives African food businesses the tools to manage teams,
                track operations, and unlock AI-powered insights — all in one place.
              </p>
            </div>

            <div className="left-stats">
              <div>
                <div className="stat-num">24/7</div>
                <div className="stat-label">AI Monitoring</div>
              </div>
              <div>
                <div className="stat-num">Zara</div>
                <div className="stat-label">Your AI Assistant</div>
              </div>
              <div>
                <div className="stat-num">Africa</div>
                <div className="stat-label">Built for here</div>
              </div>
            </div>
          </div>

          <div className="left-bottom-spacer" />
        </div>

        {/* Divider on mobile */}
        <div className="panel-divider" />

        {/* Right Panel — form */}
        <div className="right-panel">
          <div className="form-eyebrow">Secure Sign In</div>
          <h1 className="form-title">Welcome <strong>back.</strong></h1>
          <p className="form-sub">Sign in to access your operations dashboard.</p>

          <div className="field">
            <label className="field-label">Email Address</label>
            <input
              className="field-input"
              type="email"
              placeholder="you@yourbusiness.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              disabled={isDisabled}
            />
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="password-wrap">
              <input
                className="field-input"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                disabled={isDisabled}
                style={{ paddingRight: 44 }}
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword
                  ? <EyeOff style={{ width: 16, height: 16 }} />
                  : <Eye style={{ width: 16, height: 16 }} />
                }
              </button>
            </div>
          </div>

          {message && (
            <div className={`msg-box ${status === "error" ? "msg-error" : "msg-success"}`}>
              <span>{status === "success" ? "✓" : "⚠"}</span>
              <span>{message}</span>
            </div>
          )}

          <button
            className="submit-btn"
            onClick={handleLogin}
            disabled={isDisabled}
          >
            {status === "loading" ? "Signing in..." : status === "success" ? "✓ Redirecting..." : "Sign In →"}
          </button>

          <div className="form-footer">
            No account?{" "}
            <a href="https://plans.getenflowai.online/trial-signup">Start free trial</a>
          </div>

          <div className="divider" />

          <p className="copyright">© 2026 Jstack Innovations · Enflow</p>
        </div>
      </div>
    </>
  );
}
