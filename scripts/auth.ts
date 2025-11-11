import {
  get,
  post,
  del,
  setAuthToken,
  clearAuthToken,
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
 * @param windowName - name for popup window
 */
export async function handleOAuthPopup(
  authUrl: string,
  windowName: string = "oauth_login",
): Promise<ApiResponse<AuthResult>> {
  return new Promise((resolve) => {
    // open popup window
    const popup = window.open(
      authUrl,
      windowName,
      "width=500,height=600,scrollbars=yes,resizable=yes",
    );

    if (!popup) {
      resolve({
        success: false,
        error: "popup_blocked",
        data: {
          user: {
            id: "",
            username: "",
            platform: "",
            isAdmin: false,
          },
          sessionId: "",
          tokenType: "Bearer" as const,
          message: "Popup was blocked. Please allow popups and try again.",
        },
      });

      return;
    }

    // listen for message from popup
    const messageHandler = (event: MessageEvent) => {
      // check if message is our auth result
      if (event.data && event.data.success !== undefined) {
        window.removeEventListener("message", messageHandler);
        popup.close();

        // set token if successful
        if (event.data.success && event.data.sessionId) {
          setAuthToken(event.data.sessionId);
        }

        resolve(event.data);
      }
    };

    window.addEventListener("message", messageHandler);

    // handle popup being closed early by user
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener("message", messageHandler);
        resolve({
          success: false,
          error: "popup_closed",
          data: {
            user: {
              id: "",
              username: "",
              platform: "",
              isAdmin: false,
            },
            sessionId: "",
            tokenType: "Bearer",
            message:
              "Login window was closed before completing authentication.",
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
  const urlResponse = await getItchOAuthUrl();

  if (!urlResponse.success || !urlResponse.data) {
    return {
      success: false,
      error: urlResponse.error,
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

  return handleOAuthPopup(urlResponse.data.authUrl, "itch_login");
}

/**
 * complete oauth flow for google
 * same as itch, handles everything
 */
export async function loginWithGoogle(): Promise<ApiResponse<AuthResult>> {
  const urlResponse = await getGoogleOAuthUrl();

  if (!urlResponse.success || !urlResponse.data) {
    return {
      success: false,
      error: urlResponse.error,
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

  return handleOAuthPopup(urlResponse.data.authUrl, "google_login");
}
