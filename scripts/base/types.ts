export interface CharacterPersonalInfo {
  name: string;
  sex: "male" | "female" | "other";
  date_of_birth: string;
  height_in: number;
  weight_lb: number;
  eye_color: EyeColor;
  hair_color: HairColor;
  race: Race[];
  ethnicity: Ethnicity;
  location: string;
}

export interface CharacterStatic {
  head: {
    asset_id: number;
  };
  hair: {
    asset_id: number;
  };
  beard?: {
    asset_id: number;
  };
  age_lines?: {
    asset_id: number;
  };
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
  };
}

export interface CharacterDataStructure {
  info: CharacterPersonalInfo;
  static: CharacterStatic;
  placeable_movable: CharacterPlaceableMovable;
}

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

export type Race = "ai_an" | "asian" | "black" | "nh_pi" | "white" | "other";

export type Ethnicity = "hispanic_latino" | "not_hispanic_latino";

export type Platform = "newgrounds" | "itch" | "google";

export type Sex = "male" | "female" | "other";

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
  codeVerifier?: string;
  expiresAt: Date;
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
  character_data: CharacterDataStructure;
  metadata: CharacterMetadata;
}

export interface PlazaCharacter {
  upload_id: string;
  creation_time: string;
  edit_time: string | null;
  location: string;
  character_data: CharacterDataStructure;
}

export interface PlazaResponse {
  characters: PlazaCharacter[];
  count: number;
  filters: {
    country?: string;
  };
}

export interface AdminCharacter {
  id: string;
  user_id: string;
  character_data: string | CharacterDataStructure;
  created_at: string;
  last_edited_at: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface AdminCharacterWithUser extends AdminCharacter {
  username: string;
  platform: string;
  platform_user_id: string;
  user_created_at?: string;
  last_login?: string;
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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
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
  limit?: number;
}

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}
