import { get, post, put } from "./base/api-client.js";
import {
  FullCharacterData,
  CharacterDataStructure,
  PlazaResponse,
  PlazaFilters,
  ApiResponse,
} from "./base/types.js";
import { CHARACTER_NAME_ERROR_MESSAGE } from "./base/constants.js";
import { isValidCountry, validateCharacterName } from "./base/utils.js";
import { displayServerError } from "./index.js";

let RUNTIME: any;

runOnStartup(async (runtime) => {
  RUNTIME = runtime;
});

/**
 * get the current user's character data
 * @returns full character with metadata, 404 if no character
 */
export async function getUserCharacter(): Promise<
  ApiResponse<FullCharacterData>
> {
  return get<FullCharacterData>("/characters/me");
}

/**
 * upload character for the current user
 * users can only have one character. use updateUserCharacter() to modify existing
 * @param characterData - complete character data structure
 * @returns job id for async processing
 */
export async function uploadCharacter(
  characterData: CharacterDataStructure,
): Promise<ApiResponse<{ message: string; jobId: string; status: string }>> {
  const response = await post("/characters", characterData);

  if (!response.success && response.statusCode) {
    displayServerError(response.error || "Upload failed", response.statusCode);
  } else {
    RUNTIME.signal("uploadSuccess");
  }

  return response;
}

/**
 * update the current user's existing character
 * character must already exist. use uploadCharacter() for new characters
 * @param characterData - updated character data structure
 * @returns job id for async processing
 */
export async function updateUserCharacter(
  characterData: CharacterDataStructure,
): Promise<ApiResponse<{ message: string; jobId: string; status: string }>> {
  const response = await put("/characters/me", {
    character_data: characterData,
  });

  if (!response.success && response.statusCode) {
    displayServerError(response.error || "Update failed", response.statusCode);
  } else {
    RUNTIME.signal("uploadSuccess");
  }

  return response;
}

/**
 * get characters for plaza display with optional filtering
 * @param filters - optional location/limit filters
 * @returns array of plaza characters with metadata
 */
export async function getPlazaCharacters(
  filters?: PlazaFilters,
): Promise<ApiResponse<PlazaResponse>> {
  let endpoint = "/characters?view=plaza";

  if (filters) {
    const params = new URLSearchParams();
    params.append("view", "plaza");

    if (filters.country) {
      params.append("country", filters.country);
    }

    if (filters.limit) {
      params.append("limit", filters.limit.toString());
    }

    if (filters.offset) {
      params.append("offset", filters.offset.toString());
    }

    endpoint = "/characters?" + params.toString();
  }

  return get<PlazaResponse>(endpoint);
}

/**
 * get a specific character by its uuid
 * @param characterId - unique character identifier
 * @returns character data for display
 */
export async function getCharacterById(
  characterId: string,
): Promise<ApiResponse<{ character: any }>> {
  return get(`/characters/${characterId}`);
}

/**
 * check if user has a character
 * @returns true if user has an uploaded character
 */
export async function hasCharacter(): Promise<boolean> {
  const response = await getUserCharacter();
  return response.success === true;
}

/**
 * check if user can edit their character
 * @returns true if user can edit their existing character
 */
export async function canEditCharacter(): Promise<boolean> {
  const response = await getUserCharacter();
  return Boolean(response.success && response.data?.metadata?.can_edit);
}

/**
 * get plaza characters by country filter
 * @param country - country code or name to filter by
 * @param limit - maximum number of characters to return (default 100)
 */
export async function getCharactersByCountry(
  country: string,
  limit: number = 100,
): Promise<ApiResponse<PlazaResponse>> {
  return getPlazaCharacters({ country, limit });
}

/**
 * get random plaza characters
 * @param limit - max number of characters to return (default 100)
 */
export async function getRandomCharacters(
  limit: number = 100,
): Promise<ApiResponse<PlazaResponse>> {
  return getPlazaCharacters({ limit });
}

/**
 * get online character page with pagination support
 * designed for plaza list view with offset-based pagination
 * @param offset - number of characters to skip (page * limit)
 * @param limit - max number of characters to return per page (default 8)
 * @param filters - optional additional filters like country
 * @returns paginated plaza characters for list view
 */
export async function getOnlineCharacterPage(
  offset: number,
  limit: number = 8,
  filters?: Omit<PlazaFilters, 'offset' | 'limit'>,
): Promise<ApiResponse<PlazaResponse>> {
  return getPlazaCharacters({
    ...filters,
    limit,
    offset
  });
}

/**
 * basic validation for required fields before upload
 * @param characterData - character data to validate
 * @returns validation result with errors if any
 */
export function validateCharacterData(characterData: CharacterDataStructure): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // check top-level structure
  if (!characterData.info) {
    errors.push("Missing character info section");
  }
  if (!characterData.static) {
    errors.push("Missing character static section");
  }
  if (!characterData.placeable_movable) {
    errors.push("Missing character placeable/movable section");
  }

  // check required info fields
  if (characterData.info) {
    if (!characterData.info.name) {
      errors.push("Character name is required");
    } else if (!validateCharacterName(characterData.info.name).valid) {
      errors.push(CHARACTER_NAME_ERROR_MESSAGE);
    }
    if (!characterData.info.sex) {
      errors.push("Character sex is required");
    }
    if (!characterData.info.eye_color) {
      errors.push("Character eye color is required");
    }
    if (!characterData.info.hair_color) {
      errors.push("Character hair color is required");
    }
    if (
      !characterData.info.race ||
      !Array.isArray(characterData.info.race) ||
      characterData.info.race.length === 0
    ) {
      errors.push("Character race is required");
    }
    if (!characterData.info.ethnicity) {
      errors.push("Character ethnicity is required");
    }
    if (!characterData.info.location) {
      errors.push("Character country is required");
    } else if (!isValidCountry(characterData.info.location)) {
      errors.push("Invalid country selected");
    }
    if (!characterData.info.date_of_birth) {
      errors.push("Character birth date is required");
    } else {
      const birthDate = new Date(characterData.info.date_of_birth);
      const today = new Date();
      const maxDate = new Date(
        today.getFullYear() - 13,
        today.getMonth(),
        today.getDate(),
      );
      if (birthDate < new Date("1900-01-01") || birthDate > maxDate) {
        errors.push("Character must be at least 13 years old");
      }
    }
  }

  // check required static fields
  if (characterData.static) {
    if (characterData.static.head?.asset_id === undefined) {
      errors.push("Head asset_id is required");
    }
    if (characterData.static.hair?.asset_id === undefined) {
      errors.push("Hair asset_id is required");
    }
  }

  // check required placeable/movable fields
  if (characterData.placeable_movable) {
    const required: (keyof typeof characterData.placeable_movable)[] = [
      "eyes",
      "eyebrows",
      "nose",
      "lips",
    ];
    for (const field of required) {
      if (characterData.placeable_movable[field]?.asset_id === undefined) {
        errors.push(`${field} asset_id is required`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
