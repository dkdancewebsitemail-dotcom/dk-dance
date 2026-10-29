/**
 * Admin fetch wrapper that includes both cookies (credentials: include)
 * and the Bearer token from localStorage for resilience against cookie dropping.
 */
export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers || {});

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("dkdc_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: init.credentials || "include",
  });

  if (response.status === 401 && typeof window !== "undefined") {
    const isLoginPage = window.location.pathname === "/admin/login";
    if (!isLoginPage) {
      console.warn("Admin session unauthorized or expired. Redirecting to login...");
      try {
        localStorage.removeItem("dkdc_token");
      } catch {}
      window.location.href = `/admin/login?from=${encodeURIComponent(window.location.pathname)}`;
    }
  }

  return response;
}
