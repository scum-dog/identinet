import {
  ApiConfig,
  ApiResponse,
  ErrorResponse,
  RequestOptions,
} from "./types.js";
import {
  TOKEN_STORAGE_KEY,
  TOKEN_TIMESTAMP_KEY,
  TOKEN_MAX_AGE,
} from "./constants.js";

let RUNTIME: any;

runOnStartup(async (runtime) => {
  RUNTIME = runtime;
});

let config: ApiConfig = {
  baseUrl: "https://api.scum.dog",
  timeout: 10 * 1000,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};

let authToken: string | null = null;
let isInitialized = false;

type AuthStateListener = (
  isAuthenticated: boolean,
  token: string | null,
) => void;
const authStateListeners: Set<AuthStateListener> = new Set();

function isLocalStorageAvailable(): boolean {
  try {
    const test = "test";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function loadPersistedToken(): string | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);

    if (!token || !timestamp) return null;

    const tokenAge = Date.now() - parseInt(timestamp, 10);
    if (tokenAge > TOKEN_MAX_AGE) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
      return null;
    }

    return token;
  } catch (error) {
    console.warn("Error loading persisted token:", error);
    return null;
  }
}

function persistToken(token: string): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn("Error persisting token:", error);
  }
}

function clearPersistedToken(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
  } catch (error) {
    console.warn("Error clearing persisted token:", error);
  }
}

function notifyAuthStateChange(): void {
  const isAuth = authToken !== null;
  RUNTIME.callFunction("authStateChange", isAuth);

  authStateListeners.forEach((listener) => {
    try {
      listener(isAuth, authToken);
    } catch (error) {
      console.error("Error in auth state listener:", error);
    }
  });
}

export function initializeAuth(): void {
  if (isInitialized) return;

  const persistedToken = loadPersistedToken();
  if (persistedToken) {
    authToken = persistedToken;
  }

  isInitialized = true;
  notifyAuthStateChange();
}

export function addAuthStateListener(listener: AuthStateListener): () => void {
  authStateListeners.add(listener);

  listener(authToken !== null, authToken);

  return () => {
    authStateListeners.delete(listener);
  };
}

/**
 * configures api client with base settings
 */
export function configureApi(newConfig: Partial<ApiConfig>): void {
  config = { ...config, ...newConfig };

  initializeAuth();
}

/**
 * set the auth token for authenticated requests
 */
export function setAuthToken(token: string): void {
  authToken = token;
  persistToken(token);
  notifyAuthStateChange();
}

/**
 * clear auth token
 */
export function clearAuthToken(): void {
  authToken = null;
  clearPersistedToken();
  notifyAuthStateChange();
}

/**
 * get current auth token (for debugging or session checks)
 */
export function getAuthToken(): string | null {
  if (!isInitialized) {
    initializeAuth();
  }
  return authToken;
}

export function generateSecureState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function storeOAuthState(state: string): void {
  try {
    sessionStorage.setItem("oauth_state", state);
  } catch (error) {
    console.error("Error storing OAuth state:", error);
    throw new Error(
      "Unable to store OAuth state - authentication cannot proceed",
    );
  }
}

/**
 * make an authenticated http request to the api
 * automatically includes bearer token if available
 */
export async function apiRequest<T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  try {
    const url = `${config.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      ...config.defaultHeaders,
      ...options.headers,
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout || config.timeout,
    );

    requestOptions.signal = controller.signal;

    const response = await fetch(url, requestOptions);

    clearTimeout(timeoutId);

    let responseData: any;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      let errorMessage: string;
      if (typeof responseData.error === "string") {
        errorMessage = responseData.error;
      } else if (responseData.error && typeof responseData.error === "object") {
        errorMessage =
          responseData.error.message ||
          responseData.error.toString() ||
          "Server error";
      } else {
        errorMessage = `HTTP ${response.status}`;
      }

      const errorResponse: ErrorResponse = {
        error: errorMessage,
        message: responseData.message || response.statusText,
        details: responseData,
        statusCode: response.status,
      };

      if (response.status === 401) {
        clearAuthToken();
        errorResponse.error = "authentication_required";
        errorResponse.message = "Please log in to continue";
      }

      return {
        success: false,
        error: errorResponse.error,
        message: errorResponse.message,
        statusCode: errorResponse.statusCode,
      };
    }

    return {
      success: true,
      data: responseData,
      message: responseData.message,
    };
  } catch (error) {
    let errorMessage = "network_error";
    let userMessage = "Unable to connect to server";

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "request_timeout";
        userMessage = "Request timed out, please try again";
      } else {
        userMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
      message: userMessage,
    };
  }
}

export async function get<T = any>(
  endpoint: string,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, "GET", undefined, options);
}

export async function post<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, "POST", body, options);
}

export async function put<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, "PUT", body, options);
}

export async function del<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, "DELETE", body, options);
}

/**
 * check if we have a valid auth token
 */
export function isAuthenticated(): boolean {
  return authToken !== null;
}
