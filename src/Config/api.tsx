export const API_BASE = import.meta.env.VITE_API_BASE;
const USE_DIRECT = import.meta.env.VITE_USE_DIRECT === "true";

const ROUTE_MAP = {
  "/dashboard": "/api/plans/GET/CORS/dashboard.php",
  "/logout": "/api/plans/POST/logout.php",
  "/login": "/api/plans/POST/login.php",
};

export async function apiFetch(path, options = {}) {
  try {
    const base = path.split("?")[0];
    const query = path.includes("?") ? "?" + path.split("?")[1] : "";
    const resolved = USE_DIRECT ? (ROUTE_MAP[base] ?? base) : base;

    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${API_BASE}${resolved}${query}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {})
      }
    });

    return await res.json();

  } catch (err) {
    return null;
  }
}