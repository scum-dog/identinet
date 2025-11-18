export {
  configureApi,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  isAuthenticated,
} from "./base/api-client.js";

export type {
  // base types
  ApiConfig,
  ApiResponse,
  ErrorResponse,
  RequestOptions,

  // character types
  CharacterPersonalInfo,
  CharacterStatic,
  CharacterPlaceableMovable,
  CharacterDataStructure,
  CharacterMetadata,
  FullCharacterData,
  PlazaCharacter,
  PlazaResponse,
  PlazaFilters,

  // auth types
  AuthResult,
  AuthUrlResult,
  UserInfo,

  // admin types
  AdminCharacter,
  AdminUser,
  PaginatedResponse,

  // color enums
  SkinColor,
  EyeColor,
  HairColor,
} from "./base/types.js";

export {
  authenticateNewgrounds,
  getItchOAuthUrl,
  getGoogleOAuthUrl,
  verifySession,
  getCurrentUser,
  logout,
  isLoggedIn,
  handleOAuthPopup,
  loginWithItch,
  loginWithGoogle,
} from "./auth.js";

export {
  getUserCharacter,
  uploadCharacter,
  updateUserCharacter,
  getPlazaCharacters,
  getCharacterById,
  hasCharacter,
  canEditCharacter,
  getCharactersByCountry,
  getRandomCharacters,
  validateCharacterData,
} from "./characters.js";

export { isValidCountry, COUNTRIES } from "./base/constants.js";

export {
  listAllCharacters,
  getCharacterDetails,
  deleteCharacter,
  listAllUsers,
  getRecentCharacters,
  getDeletedCharacters,
  getAdminStats,
  validateAdminAccess,
} from "./admin.js";

export const IdentikitAPI = {
  configure: async (config: { baseUrl: string; timeout?: number }) => {
    const { configureApi } = await import("./base/api-client.js");
    configureApi(config);
  },

  // authentication methods
  auth: {
    newgrounds: async (sessionId: string) => {
      const { authenticateNewgrounds } = await import("./auth.js");
      return authenticateNewgrounds(sessionId);
    },

    itch: async () => {
      const { loginWithItch } = await import("./auth.js");
      return loginWithItch();
    },

    google: async () => {
      const { loginWithGoogle } = await import("./auth.js");
      return loginWithGoogle();
    },

    verify: async () => {
      const { verifySession } = await import("./auth.js");
      return verifySession();
    },

    me: async () => {
      const { getCurrentUser } = await import("./auth.js");
      return getCurrentUser();
    },

    logout: async () => {
      const { logout } = await import("./auth.js");
      return logout();
    },

    isLoggedIn: async () => {
      const { getAuthToken } = await import("./base/api-client.js");
      return getAuthToken() !== null;
    },
  },

  // character methods
  characters: {
    get: async () => {
      const { getUserCharacter } = await import("./characters.js");
      return getUserCharacter();
    },

    upload: async (data: any) => {
      const { uploadCharacter } = await import("./characters.js");
      return uploadCharacter(data);
    },

    update: async (data: any) => {
      const { updateUserCharacter } = await import("./characters.js");
      return updateUserCharacter(data);
    },

    plaza: async (filters?: any) => {
      const { getPlazaCharacters } = await import("./characters.js");
      return getPlazaCharacters(filters);
    },

    getById: async (id: string) => {
      const { getCharacterById } = await import("./characters.js");
      return getCharacterById(id);
    },

    validate: async (data: any) => {
      const { validateCharacterData } = await import("./characters.js");
      return validateCharacterData(data);
    },
  },

  // admin methods
  admin: {
    characters: async (
      page?: number,
      limit?: number,
      showDeleted?: boolean,
    ) => {
      const { listAllCharacters } = await import("./admin.js");
      return listAllCharacters(page, limit, showDeleted);
    },

    getCharacter: async (id: string) => {
      const { getCharacterDetails } = await import("./admin.js");
      return getCharacterDetails(id);
    },

    deleteCharacter: async (id: string, reason: string) => {
      const { deleteCharacter } = await import("./admin.js");
      return deleteCharacter(id, reason);
    },

    users: async (page?: number, limit?: number) => {
      const { listAllUsers } = await import("./admin.js");
      return listAllUsers(page, limit);
    },

    stats: async () => {
      const { getAdminStats } = await import("./admin.js");
      return getAdminStats();
    },
  },
};

// call this in runOnStartup function
export async function initializeIdentikitAPI(config: {
  baseUrl: string;
  timeout?: number;
  onAuthError?: () => void;
}): Promise<void> {
  const { configureApi } = await import("./base/api-client.js");

  configureApi({
    baseUrl: config.baseUrl,
    timeout: config.timeout || 10 * 1000,
    defaultHeaders: {
      "Content-Type": "application/json",
      "User-Agent": "SCUM-DOG-Identikit/1.0",
    },
  });

  console.log("API initialized:", config.baseUrl);
}

export default IdentikitAPI;
