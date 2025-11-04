export interface CharacterPersonalInfo {
  name: string;
  sex: "male" | "female" | "other";
  date_of_birth: string;
  height_in: number;
  weight_lb: number;
  location: {
    country: string;
    region?: string;
    city?: string;
  };
}

export interface CharacterStatic {
  head: {
    asset_id: number;
    skin_color: SkinColor;
  };
  hair: {
    asset_id: number;
    hair_color: HairColor;
  };
  beard?: {
    asset_id: number;
    facial_hair_color: HairColor;
  };
  age_lines?: {
    asset_id: number;
  };
}

export interface CharacterPlaceableMovable {
  eyes: {
    asset_id: number;
    eye_color: EyeColor;
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
  };
}

export interface CharacterDataStructure {
  info: CharacterPersonalInfo;
  static: CharacterStatic;
  placeable_movable: CharacterPlaceableMovable;
}

export type SkinColor =
  | "pale"
  | "light"
  | "medium"
  | "medium-tan"
  | "tan"
  | "dark"
  | "very-dark";

export type EyeColor =
  | "black"
  | "brown"
  | "gray"
  | "blue"
  | "green"
  | "hazel"
  | "maroon";

export type HairColor =
  | "bald"
  | "black"
  | "blonde"
  | "blue"
  | "brown"
  | "gray"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "sandy"
  | "white";

export interface AuthResult {
  user: {
    id: string;
    username: string;
    platform: string;
    isAdmin: boolean;
  };
  sessionId: string;
  tokenType: "Bearer";
  message: string;
}

export interface AuthUrlResult {
  authUrl: string;
  state: string;
  expiresAt: string;
}

export interface UserInfo {
  user: {
    id: string;
    username: string;
    platform: string;
    isAdmin: boolean;
  };
  character?: {
    id: string;
    created_at: string;
    last_edited_at: string;
    is_edited: boolean;
  };
  hasCharacter: boolean;
}

export interface CharacterMetadata {
  upload_id: string;
  user_id: string;
  created_at: string;
  last_edited_at: string | null;
  is_edited: boolean;
  can_edit: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface FullCharacterData {
  character: {
    upload_id: string;
    user_id: string;
    created_at: string;
    last_edited_at: string | null;
    location: object;
    character_data: CharacterDataStructure;
    is_edited: boolean;
    is_deleted: boolean;
    deleted_at: string | null;
    deleted_by: string | null;
  };
  can_edit: boolean;
}

export interface PlazaCharacter {
  upload_id: string;
  creation_time: string;
  edit_time: string | null;
  location: object;
  character_data: CharacterDataStructure;
}

export interface PlazaResponse {
  characters: PlazaCharacter[];
  count: number;
  filters: {
    country?: string;
    region?: string;
  };
}

export interface AdminCharacter {
  id: string;
  user_id: string;
  character_data: CharacterDataStructure;
  created_at: string;
  last_edited_at: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  username: string;
  platform: string;
  platform_user_id: string;
}

export interface AdminUser {
  id: string;
  username: string;
  platform: string;
  platform_user_id: string;
  created_at: string;
  last_login: string;
  is_admin: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

export interface PlazaFilters {
  country?: string;
  region?: string;
  limit?: number;
}

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}
