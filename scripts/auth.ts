import {
  get,
  post,
  del,
  setAuthToken,
  clearAuthToken,
  generateSecureState,
  storeOAuthState,
} from "./base/api-client.js";
import {
  AuthResult,
  AuthUrlResult,
  UserInfo,
  ApiResponse,
} from "./base/types.js";

/**
 * authenticate with newgrounds using session id
 * call this after the player is assigned a session from ngio
 * @param sessionId - session id
 */
export async function authenticateNewgrounds(
  sessionId: string,
): Promise<ApiResponse<AuthResult>> {
  const response = await post<AuthResult>("/auth/newgrounds/authenticate", {
    session_id: sessionId,
  });

  if (response.success && response.data?.sessionId) {
    setAuthToken(response.data.sessionId);
  }

  if (window.opener && window.opener !== window) {
    try {
      const message = {
        ...response,
        timestamp: Date.now(),
      };
      window.opener.postMessage(message, "*");
      window.close();
    } catch (error) {
      console.warn("Could not post message to parent window:", error);
    }
  }

  return response;
}

/**
 * get itch.io oauth url
 * @returns oauth url and state for verification
 */
export async function getItchOAuthUrl(): Promise<ApiResponse<AuthUrlResult>> {
  return get<AuthUrlResult>("/auth/itchio/authorization-url");
}

/**
 * get google oauth url
 * @returns oauth url and state for verification
 */
export async function getGoogleOAuthUrl(): Promise<ApiResponse<AuthUrlResult>> {
  return get<AuthUrlResult>("/auth/google/authorization-url");
}

/**
 * verify current session is still valid
 * automatically clears token if invalid
 */
export async function verifySession(): Promise<
  ApiResponse<{ valid: boolean; user?: any }>
> {
  const response = await get("/auth/session");

  if (!response.success || (response.data && !response.data.valid)) {
    clearAuthToken();
  }

  return response;
}

/**
 * get current user information and character status
 * includes user details and whether they have a character already
 */
export async function getCurrentUser(): Promise<ApiResponse<UserInfo>> {
  return get<UserInfo>("/auth/me");
}

/**
 * logout and clear session from server
 * also clears local auth token
 */
export async function logout(): Promise<
  ApiResponse<{ success: boolean; message: string }>
> {
  const response = await del("/auth/session");

  clearAuthToken();

  return response;
}

/**
 * check if user is currently logged in (has valid token)
 * this only checks local storage, use verifySession() for server validation
 */
export async function isLoggedIn(): Promise<boolean> {
  const { getAuthToken } = await import("./base/api-client.js");
  return getAuthToken() !== null;
}

/**
 * handle popup flow for itch/google
 * @param authUrl - URL from getItchOAuthUrl() or getGoogleOAuthUrl()
 * @param provider - OAuth provider name for fallback redirect
 * @param windowName - name for popup window
 * @param timeoutMs - timeout in milliseconds (default 5 minutes)
 */
export async function handleOAuthPopup(
  authUrl: string,
  provider: string,
  windowName: string = "oauth_login",
  timeoutMs: number = 5 * 60 * 1000,
): Promise<ApiResponse<AuthResult>> {
  return new Promise((resolve) => {
    let isResolved = false;
    let popup: Window | null = null;
    let timeoutId: number | null = null;
    let checkClosedInterval: number | null = null;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (checkClosedInterval) clearInterval(checkClosedInterval);
      window.removeEventListener("message", messageHandler);

      if (popup && !popup.closed) {
        try {
          popup.close();
        } catch (error) {
          console.warn("Could not close popup:", error);
        }
      }
    };

    const resolveOnce = (result: ApiResponse<AuthResult>) => {
      if (isResolved) return;
      isResolved = true;
      cleanup();
      resolve(result);
    };

    let state: string;
    try {
      state = generateSecureState();
      storeOAuthState(state);
    } catch (error) {
      console.error("Error setting up OAuth state:", error);
      resolveOnce({
        success: false,
        error: "state_setup_failed",
        message: "Unable to set up secure authentication",
        data: {
          user: { id: "", username: "", platform: "", isAdmin: false },
          sessionId: "",
          tokenType: "Bearer" as const,
          message: "Security setup failed",
        },
      });
      return;
    }

    try {
      popup = window.open(
        authUrl,
        windowName,
        "width=500,height=600,scrollbars=yes,resizable=yes,location=yes",
      );

      if (!popup || popup.closed) {
        throw new Error("Popup blocked or failed to open");
      }

      setTimeout(() => {
        if (!popup || popup.closed) {
          handlePopupBlocked();
        }
      }, 100);
    } catch (error) {
      console.warn("Popup failed to open:", error);
      handlePopupBlocked();
      return;
    }

    function handlePopupBlocked() {
      console.log("Popup blocked, falling back to full page redirect");

      try {
        sessionStorage.setItem("oauth_return_url", window.location.href);
      } catch (e) {
        console.warn("Could not store return URL:", e);
      }

      window.location.href = authUrl;

      return;
    }

    const messageHandler = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") {
        return;
      }

      if (event.data.success !== undefined && event.data.timestamp) {
        console.log("Received auth message from popup:", event.data);

        const messageAge = Date.now() - event.data.timestamp;
        if (messageAge > 30000) {
          console.warn("Auth message too old, ignoring");
          return;
        }

        if (
          event.data.success &&
          event.data.data &&
          event.data.data.sessionId
        ) {
          setAuthToken(event.data.data.sessionId);
        }

        const result: ApiResponse<AuthResult> = {
          success: event.data.success,
          error: event.data.error,
          message: event.data.message,
          data: event.data.data || {
            user: { id: "", username: "", platform: "", isAdmin: false },
            sessionId: "",
            tokenType: "Bearer" as const,
            message: event.data.message || "",
          },
        };

        resolveOnce(result);
      }
    };

    window.addEventListener("message", messageHandler);

    timeoutId = setTimeout(() => {
      console.warn("OAuth popup timed out");
      resolveOnce({
        success: false,
        error: "timeout",
        message: "Authentication timed out. Please try again.",
        data: {
          user: { id: "", username: "", platform: "", isAdmin: false },
          sessionId: "",
          tokenType: "Bearer" as const,
          message: "Login timed out",
        },
      });
    }, timeoutMs);

    checkClosedInterval = setInterval(() => {
      if (popup && popup.closed) {
        console.log("User closed popup manually");
        resolveOnce({
          success: false,
          error: "popup_closed",
          message: "Login window was closed before completing authentication.",
          data: {
            user: { id: "", username: "", platform: "", isAdmin: false },
            sessionId: "",
            tokenType: "Bearer" as const,
            message: "Login cancelled by user",
          },
        });
      }
    }, 1000);
  });
}

/**
 * complete oauth flow for itch
 * handles everything, including popups
 */
export async function loginWithItch(): Promise<ApiResponse<AuthResult>> {
  const maxRetries = 3;
  const retryDelay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const urlResponse = await getItchOAuthUrl();

      if (!urlResponse.success || !urlResponse.data) {
        if (attempt === maxRetries) {
          return {
            success: false,
            error: urlResponse.error,
            message:
              urlResponse.message ||
              "Failed to get OAuth URL after multiple attempts",
            data: {
              user: {
                id: "",
                username: "",
                platform: "",
                isAdmin: false,
              },
              sessionId: "",
              tokenType: "Bearer" as const,
              message: urlResponse.message || "Failed to get OAuth URL",
            },
          };
        }

        console.log(
          `Itch OAuth URL request failed (attempt ${attempt}/${maxRetries}), retrying in ${retryDelay}ms...`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt),
        );
        continue;
      }

      return handleOAuthPopup(urlResponse.data.authUrl, "itch", "itch_login");
    } catch (error) {
      console.error(`Itch OAuth attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        return {
          success: false,
          error: "network_error",
          message: "Failed to connect to Itch.io after multiple attempts",
          data: {
            user: {
              id: "",
              username: "",
              platform: "",
              isAdmin: false,
            },
            sessionId: "",
            tokenType: "Bearer" as const,
            message: "Network error - please check your connection",
          },
        };
      }

      await new Promise((resolve) =>
        setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1)),
      );
    }
  }

  return {
    success: false,
    error: "unknown_error",
    message: "Unknown error occurred",
    data: {
      user: { id: "", username: "", platform: "", isAdmin: false },
      sessionId: "",
      tokenType: "Bearer" as const,
      message: "Unknown error",
    },
  };
}

/**
 * complete oauth flow for google
 * handles everything, including popups
 */
export async function loginWithGoogle(): Promise<ApiResponse<AuthResult>> {
  const maxRetries = 3;
  const retryDelay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const urlResponse = await getGoogleOAuthUrl();

      if (!urlResponse.success || !urlResponse.data) {
        if (attempt === maxRetries) {
          return {
            success: false,
            error: urlResponse.error,
            message:
              urlResponse.message ||
              "Failed to get OAuth URL after multiple attempts",
            data: {
              user: {
                id: "",
                username: "",
                platform: "",
                isAdmin: false,
              },
              sessionId: "",
              tokenType: "Bearer" as const,
              message: urlResponse.message || "Failed to get OAuth URL",
            },
          };
        }

        console.log(
          `Google OAuth URL request failed (attempt ${attempt}/${maxRetries}), retrying...`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt),
        );
        continue;
      }

      return handleOAuthPopup(
        urlResponse.data.authUrl,
        "google",
        "google_login",
      );
    } catch (error) {
      console.error(`Google OAuth attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        return {
          success: false,
          error: "network_error",
          message: "Failed to connect to Google after multiple attempts",
          data: {
            user: {
              id: "",
              username: "",
              platform: "",
              isAdmin: false,
            },
            sessionId: "",
            tokenType: "Bearer" as const,
            message: "Network error - please check your connection",
          },
        };
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
    }
  }

  return {
    success: false,
    error: "unknown_error",
    message: "Unknown error occurred",
    data: {
      user: { id: "", username: "", platform: "", isAdmin: false },
      sessionId: "",
      tokenType: "Bearer" as const,
      message: "Unknown error",
    },
  };
}
