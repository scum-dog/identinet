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

  // types from constants
  Country,
  Sex,
  Race,
  Ethnicity,
  EyeColor,
  HairColor,
} from "./base/types.js";

// value arrays
export {
  SEX_VALUES,
  RACE_VALUES,
  ETHNICITY_VALUES,
  EYE_COLOR_VALUES,
  HAIR_COLOR_VALUES,
} from "./base/types.js";

// auth
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

// characters
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

// constants
export {
  CHARACTER_NAME_MAX_LENGTH,
  CHARACTER_NAME_REGEX,
  CHARACTER_NAME_ERROR_MESSAGE,
  COUNTRIES,
  MONTHS,
  SEXES,
  RACES,
  ETHNICITIES,
  EYE_COLORS,
  HAIR_COLORS,
} from "./base/constants.js";

// utils
export {
  getJSONValue,
  setJSONValue,
  deleteJSONValue,
  isValidCountry,
  validateCharacterName,
  validateInputName,
  buildDateFromComponents,
  mapDropdownValueToKey,
  shouldDeleteField,
  handleRaceMutualExclusivity,
} from "./base/utils.js";

// admin
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

export default IdentikitAPI;

declare function runOnStartup(
  callback: (runtime: any) => void | Promise<void>,
): void;

runOnStartup(async (runtime: any) => {
  runtime.addEventListener("beforeprojectstart", () =>
    OnBeforeProjectStart(runtime),
  );

  // Styling
  var style = document.createElement("style");
  style.innerText = `
	/* Input Name styling */
	.input {
		background-color:#DDDDDD;
    border:calc(1px * var(--construct-scale)) solid #000000;
    padding:0px calc(3px * var(--construct-scale));
    font-size:calc(8px * var(--construct-scale));
    font-weight:bold;
    color:#000000;
	}

  /* Input Dropdown styling */
  select {
    appearance:none;
    -webkit-appearance:none;
    -moz-appearance:none;

    background-image:url(arrow.svg);
    background-repeat:no-repeat;
    background-position:right calc(3px * var(--construct-scale)) center;
    background-size:calc(8px * var(--construct-scale));
    cursor:pointer;
  }

  /* Input Slider styling */
  input[type="range"] {
    -webkit-appearance:none;
    margin:0px;

    cursor:pointer;
    background-color:#DDDDDD;
    border:calc(1px * var(--construct-scale)) solid #000000;
  }

  ::-webkit-slider-thumb {
    -webkit-appearance:none;
    appearance:none;
    box-shadow:none;

    cursor:pointer;
    background:#999999;
    width:calc(8px * var(--construct-scale));
    height:calc(12px * var(--construct-scale));
    border:calc(1px * var(--construct-scale)) solid #000000;
  }

  ::-moz-range-thumb {
    appearance:none;
    border-radius:0px;
  
    cursor:pointer;
    background:#999999;
    width:calc(8px * var(--construct-scale));
    height:calc(12px * var(--construct-scale));
    border:calc(1px * var(--construct-scale)) solid #000000;
  }
	`;

  document.head.appendChild(style);
});

async function initializeAPI(): Promise<void> {
  const { configureApi } = await import("./base/api-client.js");
  configureApi({});
  console.log("API ready");
}

async function OnBeforeProjectStart(runtime: any) {
  await initializeAPI();
}
