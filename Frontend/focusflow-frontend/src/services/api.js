import axios from "axios";

export const TOKEN_ACCESS_KEY = "focusflow_access";
export const TOKEN_REFRESH_KEY = "focusflow_refresh";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 30000;

export const getAccessToken = () => localStorage.getItem(TOKEN_ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(TOKEN_REFRESH_KEY);

const setTokens = (access, refresh) => {
  if (access) localStorage.setItem(TOKEN_ACCESS_KEY, access);
  if (refresh) localStorage.setItem(TOKEN_REFRESH_KEY, refresh);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_ACCESS_KEY);
  localStorage.removeItem(TOKEN_REFRESH_KEY);
};

const subscribers = [];
let isRefreshing = false;

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function onRefreshed(accessToken) {
  subscribers.forEach((cb) => cb(accessToken));
  subscribers.length = 0;
}

export function buildAuthError(axiosError) {
  const details =
    axiosError?.response?.data?.detail ||
    (axiosError?.response?.data &&
      typeof axiosError.response.data === "object"
      ? Object.entries(axiosError.response.data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
          .join("; ")
      : null) ||
    axiosError?.response?.statusText ||
    axiosError?.message ||
    "Request failed";

  const status = axiosError?.response?.status || 0;

  if (!axiosError?.response) {
    return {
      status: 0,
      code: "network_error",
      message:
        "Unable to reach the FocusFlow server. Check your connection and try again.",
      fields: null,
    };
  }

  if (status === 400) {
    return {
      status,
      code: "validation_error",
      message: details,
      fields:
        typeof axiosError.response.data === "object"
          ? axiosError.response.data
          : null,
    };
  }

  if (status === 401) {
    return {
      status,
      code: "unauthorized",
      message:
        details?.includes?.("No active account") ||
        details?.includes?.("Unable to log in")
          ? details
          : "Invalid credentials. Please try again.",
      fields: axiosError.response.data || null,
    };
  }

  if (status === 403) {
    return {
      status,
      code: "forbidden",
      message: "You do not have permission to perform this action.",
      fields: null,
    };
  }

  if (status === 404) {
    return {
      status,
      code: "not_found",
      message: "The requested resource was not found.",
      fields: null,
    };
  }

  if (status >= 500) {
    return {
      status,
      code: "server_error",
      message:
        "FocusFlow is experiencing server issues. Please try again shortly.",
      fields: null,
    };
  }

  return { status, code: "unknown_error", message: details, fields: null };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status !== 401 || originalRequest._retry || !getRefreshToken()) {
      return Promise.reject(buildAuthError(error));
    }

    if (isRefreshing) {
      return new Promise((resolve, _reject) => {
        subscribeTokenRefresh((token) => {
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(axios(originalRequest));
        });
      }).catch((err) => Promise.reject(buildAuthError(err)));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/token/refresh/`,
        { refresh: getRefreshToken() },
        {
          timeout: REQUEST_TIMEOUT_MS,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      setTokens(data.access, data.refresh || getRefreshToken());
      onRefreshed(data.access);
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
      }
      return axios(originalRequest);
    } catch (refreshErr) {
      clearTokens();
      onRefreshed(null);
      clearTokens();
      window.location.href="/login";
      return Promise.reject(buildAuthError(refreshErr));
    } finally {
      isRefreshing = false;
    }
  }
);

export { API_BASE_URL };
export default api;
