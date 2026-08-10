import api, { clearTokens, buildAuthError } from "@/services/api";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const normalizeUser = (payload) => {
  if (!payload) return null;
  const data = Array.isArray(payload) ? payload[0] : payload;
  if (!data) return null;
  return {
    id: data.id ?? data.pk ?? null,
    name:
      data.full_name ||
      data.name ||
      (data.first_name
        ? `${data.first_name} ${data.last_name || ""}`.trim()
        : null) ||
      data.username ||
      data.email ||
      null,
    email: data.email || null,
    username: data.username || null,
    role: data.role || data.user_role || data.position || "Member",
    avatar: data.avatar || data.profile_image || data.profile?.avatar || "",
    streak: data.streak ?? data.current_streak ?? 0,
  };
};

export async function login(email, password) {
  try {
    const res = await api.post("/api/token/", { username: email, password });
    const { access, refresh } = res.data || {};
    if (!access) throw new Error("No access token missing");
    localStorage.setItem("focusflow_access", access);
    if (refresh) localStorage.setItem("focusflow_refresh", refresh);
    try {
      const profile = await getCurrentUser();
      return { success: true, user: profile };
    } catch {
      return { success: true, user: null };
    }
  } catch (err) {
    const typed = buildAuthError(err);
    if (typed.code === "network_error") {
      throw typed;
    }
    if (typed.code === "validation_error" && typed.fields) {
      const firstMsg =
        (Array.isArray(typed.fields.non_field_errors) &&
          typed.fields.non_field_errors[0]) ||
        (Array.isArray(typed.fields.detail) && typed.fields.detail[0]) ||
        (typeof typed.fields.detail === "string" && typed.fields.detail) ||
        typed.message;
      throw { ...typed, message: firstMsg || typed.message };
    }
    throw typed;
  }
}

export async function register(name, email, password) {
  try {
    const [firstName, ...rest] = name.trim().split(" ");

const payload = {
  username: email,
  first_name: firstName,
  last_name: rest.join(" "),
  email,
  password,
};
    const res = await api.post("/api/auth/register/", payload);
    const created = res.data;
    try {
      const loginRes = await api.post("/api/token/", {
        username: email,
        password,
      });
      const { access, refresh } = loginRes.data || {};
      if (access) localStorage.setItem("focusflow_access", access);
      if (refresh) localStorage.setItem("focusflow_refresh", refresh);
    } catch {
      await delay(250);
    }
    try {
      const profile = await getCurrentUser();
      return { success: true, user: profile || normalizeUser(created) };
    } catch {
      return { success: true, user: normalizeUser(created) };
    }
  } catch (err) {
    const typed = buildAuthError(err);
    if (typed.code === "validation_error" && typed.fields) {
      const msg =
        (Array.isArray(typed.fields.email) && typed.fields.email[0]) ||
        (Array.isArray(typed.fields.password) && typed.fields.password[0]) ||
        (Array.isArray(typed.fields.username) && typed.fields.username[0]) ||
        typed.message;
      throw { ...typed, message: msg || typed.message };
    }
    throw typed;
  }
}

export async function logout() {
  try {
    const refresh = localStorage.getItem("focusflow_refresh");
    if (refresh) {
      await api.post("/api/token/refresh/", { refresh });
    }
  } catch (_) {
    /* ignore */
  }
  try {
    await api.post("/api/auth/logout/");
  } catch (_) {
      /* ignore */
    }
  clearTokens();
  return { success: true };
}

export async function refreshToken() {
  const refresh = localStorage.getItem("focusflow_refresh");
  if (!refresh) {
    throw {
    code: "no_refresh",
    message: "No refresh token available.",
    status: 401,
  };
}
  const res = await api.post("/api/token/refresh/", { refresh });
  const { access, refresh: nextRefresh } = res.data || {};
  if (access) localStorage.setItem("focusflow_access", access);
  if (nextRefresh) localStorage.setItem("focusflow_refresh", nextRefresh);
  return { access, refresh: nextRefresh || refresh };
}

export async function verifyToken() {
  const access = localStorage.getItem("focusflow_access");
  if (!access) {
    return { valid: false };
  }
  try {
    await api.post("/api/token/verify/", { token: access });
    return { valid: true };
  } catch {
    return { valid: false };
  }
}

export async function getCurrentUser() {
  const res = await api.get("/api/auth/profile/");
  return normalizeUser(res.data);
}
