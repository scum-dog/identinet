import { get, post, put } from "./base/api-client.js";
import {
  FullCharacterData,
  CharacterDataStructure,
  PlazaResponse,
  PlazaFilters,
  ApiResponse,
} from "./base/types.js";

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
  return post("/characters", {
    character: characterData,
  });
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
  return put("/characters/me", {
    character_data: characterData,
  });
}

/**
 * get characters for plaza display with optional filtering
 * @param filters - optional location/limit filters
 * @returns array of plaza characters with metadata
 */
export async function getPlazaCharacters(
  filters?: PlazaFilters,
): Promise<ApiResponse<PlazaResponse>> {
  let endpoint = "/characters/plaza";

  if (filters) {
    const params = new URLSearchParams();

    if (filters.country) {
      params.append("country", filters.country);
    }

    if (filters.region) {
      params.append("region", filters.region);
    }

    if (filters.limit) {
      params.append("limit", filters.limit.toString());
    }

    if (params.toString()) {
      endpoint += "?" + params.toString();
    }
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
  return Boolean(response.success && response.data?.can_edit);
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
 * get plaza characters by region filter
 * @param country - country code or name
 * @param region - region/state within country
 * @param limit - maximum number of characters to return (default 100)
 */
export async function getCharactersByRegion(
  country: string,
  region: string,
  limit: number = 100,
): Promise<ApiResponse<PlazaResponse>> {
  return getPlazaCharacters({ country, region, limit });
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
 * extract location info from character data
 * @param characterData - character data structure
 * @returns formatted location object
 */
export function getCharacterLocation(characterData: CharacterDataStructure): {
  country?: string;
  region?: string;
  city?: string;
} {
  return characterData.info.location || {};
}

/**
 * basic validation for required fields before upload
 * @param characterData - character data to validate
 * @returns validation result with errors if any
 */
export function validateCharacterData(characterData: any): {
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
    }
    if (!characterData.info.sex) {
      errors.push("Character sex is required");
    }
    if (!characterData.info.location?.country) {
      errors.push("Character country is required");
    }
  }

  // check required static fields
  if (characterData.static) {
    if (!characterData.static.head?.asset_id) {
      errors.push("Head asset_id is required");
    }
    if (!characterData.static.hair?.asset_id) {
      errors.push("Hair asset_id is required");
    }
  }

  // check required placeable/movable fields
  if (characterData.placeable_movable) {
    const required = ["eyes", "eyebrows", "nose", "lips"];
    for (const field of required) {
      if (!characterData.placeable_movable[field]?.asset_id) {
        errors.push(`${field} asset_id is required`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
