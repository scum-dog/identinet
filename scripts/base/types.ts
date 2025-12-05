import {
  COUNTRIES,
  SEXES,
  RACES,
  ETHNICITIES,
  EYE_COLORS,
  HAIR_COLORS,
} from "./constants.js";

// derived from constants
export type Country = (typeof COUNTRIES)[number];

// value arrays
export const SEX_VALUES = Object.keys(SEXES) as Sex[];
export const RACE_VALUES = Object.keys(RACES) as Race[];
export const ETHNICITY_VALUES = Object.keys(ETHNICITIES) as Ethnicity[];
export const EYE_COLOR_VALUES = Object.keys(EYE_COLORS) as EyeColor[];
export const HAIR_COLOR_VALUES = Object.keys(HAIR_COLORS) as HairColor[];

// CHARACTERS
export type Sex = "male" | "female" | "other";

export type Race = "ai_an" | "asian" | "black" | "nh_pi" | "white" | "other";

export type Ethnicity = "hispanic_latino" | "not_hispanic_latino";

export type EyeColor =
  | "black"
  | "blue"
  | "brown"
  | "gray"
  | "green"
  | "hazel"
  | "maroon"
  | "pink";

export type HairColor =
  | "bald"
  | "black"
  | "blond"
  | "brown"
  | "gray"
  | "red"
  | "sandy"
  | "white";

export interface CharacterInfo {
  name: string;
  sex: Sex;
  date_of_birth: string;
  height_in: number;
  weight_lb: number;
  eye_color: EyeColor;
  hair_color: HairColor;
  race: Race[];
  ethnicity: Ethnicity;
  location: Country;
}

export interface CharacterStatic {
  head: { asset_id: number };
  hair: { asset_id: number };
  beard?: { asset_id: number };
  age_lines?: { asset_id: number };
}

export interface CharacterPlaceableMovable {
  eyes: {
    asset_id: number;
    offset_x: number;
    offset_y: number;
    scale: number;
    rotation: number;
  };
  eyebrows: {
    asset_id: number;
    offset_x: number;
    offset_y: number;
    scale: number;
    rotation: number;
  };
  nose: {
    asset_id: number;
    offset_y: number;
    scale: number;
  };
  lips: {
    asset_id: number;
    offset_y: number;
    scale: number;
  };
  glasses?: {
    asset_id: number;
    offset_y: number;
    scale: number;
  };
  mustache?: {
    asset_id: number;
    offset_y: number;
    scale: number;
  };
  misc?: {
    asset_id: number;
    offset_x?: number;
    offset_y: number;
    scale?: number;
    rotation?: number;
  };
}

export interface CharacterData {
  info: CharacterInfo;
  static: CharacterStatic;
  placeable_movable: CharacterPlaceableMovable;
}

export interface CharacterMetadata {
  id: string;
  user_id: string;
  created_at: string;
  last_edited_at: string | null;
  can_edit: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface Character extends CharacterMetadata {
  character_data: CharacterData;
}

export interface CharacterWithUser extends Character {
  username: string;
  platform: Platform;
  platform_user_id: string;
  user_created_at?: string;
  last_login?: string;
}

// AUTHENTICATION
export type Platform = "newgrounds" | "itch" | "google" | "";

export interface PlatformUser {
  id: string;
  username: string;
  platform?: Platform;
  is_admin?: boolean;
}

export interface AuthUrlResult {
  authUrl: string;
  state: string;
  codeVerifier?: string;
  expiresAt: Date;
}

// ROUTE INTERFACES
export interface PlazaCharacter extends Pick<
  Character,
  "id" | "created_at" | "last_edited_at" | "character_data"
> {
  location: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PlazaResponse {
  characters: PlazaCharacter[];
  count: number;
  total: number;
  filters: { country?: string };
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  defaultHeaders: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  statusCode: number;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

export interface User {
  id: string;
  username: string;
  platform: Platform;
  isAdmin: boolean;
}

export interface AuthResult {
  user: User;
  sessionId: string;
  tokenType: "Bearer";
  message: string;
}
