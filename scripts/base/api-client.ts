import {
  ApiConfig,
  ApiResponse,
  ErrorResponse,
  RequestOptions,
} from "./types.js";

let config: ApiConfig = {
  baseUrl: "https://api.scum.dog",
  timeout: 10 * 1000,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};

let authToken: string | null = null;

/**
 * configures api client with base settings
 * call this once when initializing the game
 */
export function configureApi(newConfig: Partial<ApiConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * set the auth token for authenticated requests
 * call this after successful login
 */
export function setAuthToken(token: string): void {
  authToken = token;
}

/**
 * clear auth token
 * call this on logout
 */
export function clearAuthToken(): void {
  authToken = null;
}

/**
 * get current auth token (for debugging or session checks)
 */
export function getAuthToken(): string | null {
  return authToken;
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
      const errorResponse: ErrorResponse = {
        error: responseData.error || `HTTP ${response.status}`,
        message: responseData.message || response.statusText,
        details: responseData,
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

/**
 * handle api responses in game code
 * returns data on success, throws error on failure
 */
export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.error || "unknown_error");
}
