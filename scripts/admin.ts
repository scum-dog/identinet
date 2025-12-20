import { get, del } from "./base/api-client.js";
import {
  CharacterWithUser,
  User,
  UserSessionData,
  Pagination,
  ApiResponse,
} from "./base/types.js";

let RUNTIME: any;

runOnStartup(async (runtime) => {
  RUNTIME = runtime;
});


/**
 * get paginated user list with optional filters
 * @param page - page number (starts at 1)
 * @param limit - results per page (max 100, default 50)
 * @param showDeleted - include deleted characters in results
 * @returns paginated list of characters with user info
 */
export async function listAllCharacters(
  page: number = 1,
  limit: number = 50,
  showDeleted: boolean = false,
): Promise<
  ApiResponse<{ characters: CharacterWithUser[]; pagination: Pagination }>
> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: Math.min(limit, 100).toString(),
  });

  if (showDeleted) {
    params.append("showDeleted", "true");
  }

  return get(`/admin/characters?${params.toString()}`);
}

/**
 * get detailed information about a specific character
 * @param characterId - unique character identifier
 * @returns character details and associated user info
 */
export async function getCharacterDetails(
  characterId: string,
): Promise<ApiResponse<{ character: CharacterWithUser }>> {
  return get(`/admin/characters/${characterId}`);
}

/**
 * marks character as deleted with reason tracking
 * @param characterId - unique character identifier
 * @param reason - required reason for deletion (1-500 characters)
 * @returns deletion confirmation with job id
 */
export async function deleteCharacter(
  characterId: string,
  reason: string,
): Promise<ApiResponse<any>> {
  if (!reason || reason.trim().length === 0) {
    const response = {
      success: false,
      error: "validation_error",
      data: {
        message: "Deletion reason is required",
      },
    };

    RUNTIME.callFunction("error", "Deletion reason is required.");
    return response;
  }

  if (reason.length > 500) {
    const response = {
      success: false,
      error: "validation_error",
      data: {
        message: "Deletion reason must be 500 characters or less",
      },
    };

    RUNTIME.callFunction("error", "Deletion reason must be 500 characters or less.");
    return response;
  }

  const response = await del(`/admin/characters/${characterId}`, { reason });

  if (response.success) {
    // Blank cached uploaded character
    if (characterId === RUNTIME.globalVars.SERVER_uploadedCharacterID) RUNTIME.callFunction("setUploadedCharacter", "", "");
    RUNTIME.signal("delete");
  } else {
    RUNTIME.callFunction("error", "An unknown error occurred.");
  }

  return response;
}

/**
 * get paginated list of all registered users
 * @param page - page number (starts at 1)
 * @param limit - results per page (max 100, default 50)
 * @returns paginated list of users
 */
export async function listAllUsers(
  page: number = 1,
  limit: number = 50,
): Promise<ApiResponse<{ users: User[]; pagination: Pagination }>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: Math.min(limit, 100).toString(),
  });

  return get(`/admin/users?${params.toString()}`);
}

/**
 * get recently created characters
 * @param limit - number of recent characters to get
 * @returns most recently created characters
 */
export async function getRecentCharacters(
  limit: number = 20,
): Promise<
  ApiResponse<{ characters: CharacterWithUser[]; pagination: Pagination }>
> {
  return listAllCharacters(1, limit, false);
}

/**
 * get deleted characters
 * @param limit - number of deleted characters to get
 * @returns recently deleted characters
 */
export async function getDeletedCharacters(
  limit: number = 50,
): Promise<
  ApiResponse<{ characters: CharacterWithUser[]; pagination: Pagination }>
> {
  const response = await listAllCharacters(1, limit, true);

  if (!response.success || !response.data) {
    return response;
  }

  const deletedCharacters = response.data.characters.filter(
    (char) => char.is_deleted,
  );

  return {
    success: true,
    data: {
      characters: deletedCharacters,
      pagination: {
        page: 1,
        limit: deletedCharacters.length,
        total: deletedCharacters.length,
        totalPages: 1,
      },
    },
  };
}

/**
 * get admin statistics
 * @returns basic stats about users/characters
 */
export async function getAdminStats(): Promise<{
  totalUsers: number;
  totalCharacters: number;
  activeCharacters: number;
  deletedCharacters: number;
  platformBreakdown: Record<string, number>;
}> {
  try {
    const [usersResponse, charactersResponse, deletedResponse] =
      await Promise.all([
        listAllUsers(1, 1000),
        listAllCharacters(1, 1000, false),
        listAllCharacters(1, 1000, true),
      ]);

    const users = usersResponse.success ? usersResponse.data?.users || [] : [];
    const characters = charactersResponse.success
      ? charactersResponse.data?.characters || []
      : [];
    const allCharacters = deletedResponse.success
      ? deletedResponse.data?.characters || []
      : [];

    const platformBreakdown: Record<string, number> = {};
    users.forEach((user) => {
      platformBreakdown[user.platform] =
        (platformBreakdown[user.platform] || 0) + 1;
    });

    return {
      totalUsers: users.length,
      totalCharacters: allCharacters.length,
      activeCharacters: characters.length,
      deletedCharacters: allCharacters.filter((c) => c.is_deleted).length,
      platformBreakdown,
    };
  } catch (error) {
    return {
      totalUsers: 0,
      totalCharacters: 0,
      activeCharacters: 0,
      deletedCharacters: 0,
      platformBreakdown: {},
    };
  }
}

/**
 * validate admin permissions
 * (just checks auth response, server ultimately validates)
 */
export async function validateAdminAccess(): Promise<boolean> {
  try {
    const { getCurrentUser } = await import("./auth.js");
    const response = await getCurrentUser();
    return Boolean(response.success && response.data?.user?.isAdmin);
  } catch {
    return false;
  }
}
