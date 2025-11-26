import {
  COUNTRIES,
  MONTHS,
  SEXES,
  RACES,
  ETHNICITIES,
  EYE_COLORS,
  HAIR_COLORS,
  CHARACTER_NAME_MAX_LENGTH,
  CHARACTER_NAME_REGEX,
  CHARACTER_NAME_ERROR_MESSAGE,
} from "./constants.js";

import type { Country } from "./types";

/**
 * checks if a given country is in the approved country list
 * @param country - country string to validate
 * @returns true if country is valid, false otherwise
 */
export function isValidCountry(country: string): boolean {
  return COUNTRIES.includes(country as Country);
}

/**
 * validate character name with error messages
 * @param name - character name to validate
 * @returns validation result with specific error message
 */
export function validateCharacterName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.length === 0) {
    return { valid: false, error: "Character name is required" };
  }

  if (name.length > CHARACTER_NAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Name must be ${CHARACTER_NAME_MAX_LENGTH} characters or less`,
    };
  }

  if (!CHARACTER_NAME_REGEX.test(name)) {
    return { valid: false, error: CHARACTER_NAME_ERROR_MESSAGE };
  }

  if (
    /[ ]{2,}|[-]{2,}|['][ ']/.test(name) ||
    name.includes("..") ||
    name.includes("--") ||
    name.includes("''")
  ) {
    return {
      valid: false,
      error: "Name cannot have consecutive punctuation or spaces",
    };
  }

  if (/\./.test(name)) {
    const invalidPeriodPattern = /[a-z]{2,}\.[a-z]/;
    if (invalidPeriodPattern.test(name)) {
      return {
        valid: false,
        error:
          "Periods can only be used for abbreviations (e.g., 'H. W.' or 'J.K.')",
      };
    }
  }

  return { valid: true };
}

/**
 * sanitize text input to conform to type rules
 * @param runtime - C3 runtime instance
 * @returns sanitized text that conforms to type's rules
 */
export function validateInputName(runtime: any): string {
  const input_text = (runtime.getElement() as HTMLInputElement).value;

  if (!input_text || typeof input_text !== "string") {
    return "";
  }

  // remove all invalid characters
  let sanitized = input_text.replace(/[^A-Za-z'. -]/g, "");

  // remove leading non-letters
  sanitized = sanitized.replace(/^[^A-Za-z]+/, "");

  // remove consecutive punctuation
  sanitized = sanitized.replace(/([.' -])[.' -]+/g, "$1");

  // truncate to max length
  if (sanitized.length > CHARACTER_NAME_MAX_LENGTH) {
    sanitized = sanitized.substring(0, CHARACTER_NAME_MAX_LENGTH).trim();
  }

  // if no letters remain, return empty string
  if (!/[A-Za-z]/.test(sanitized)) {
    return "";
  }

  return sanitized;
}

/**
 * get the value of provided JSON key
 * @param runtime - C3 runtime instance (JSON)
 * @param key - JSON key path
 */
export function getJSONValue(runtime: any, key: string): string {
  const json_object = runtime;
  const json_data = json_object.getJsonDataCopy();

  const parts = key.split(".");
  let ref: any = json_data;

  for (const p of parts) {
    if (ref == null || typeof ref !== "object") return "";
    ref = ref[p];
  }

  return ref;
}

/**
 * set the value of provided JSON key
 * @param runtime - C3 runtime instance (JSON)
 * @param key - JSON key path
 * @param value - JSON value
 */
export function setJSONValue(runtime: any, key: string, value: string) {
  const json_object = runtime;
  let json_data = json_object.getJsonDataCopy();

  const parts = key.split(".");
  let ref: any = json_data;

  for (let i = 0; i < parts.length - 1; i++) {
    ref = ref[parts[i]];
    if (ref === undefined) return;
  }

  ref[parts[parts.length - 1]] = value;

  json_object.setJsonDataCopy(json_data);
}

/**
 * delete the provided JSON key
 * @param runtime - C3 runtime instance (JSON)
 * @param key - JSON key path to delete
 */
export function deleteJSONValue(runtime: any, key: string): void {
  const json_object = runtime;
  let json_data = json_object.getJsonDataCopy();

  const parts = key.split(".");
  let ref: any = json_data;

  for (let i = 0; i < parts.length - 1; i++) {
    ref = ref[parts[i]];
    if (ref === undefined) return;
  }

  const lastKey = parts[parts.length - 1];

  if (Array.isArray(ref) && !isNaN(parseInt(lastKey))) {
    const index = parseInt(lastKey);
    ref.splice(index, 1);
  } else {
    delete ref[lastKey];
  }

  json_object.setJsonDataCopy(json_data);
}

/**
 * build date string from component changes
 * @param listType - which date component is being changed (month/day/year)
 * @param selectedText - the selected dropdown text
 * @param currentDate - current date_of_birth value
 * @returns formatted YYYY-MM-DD date string
 */
export function buildDateFromComponents(
  listType: string,
  selectedText: string,
  currentDate: string,
): string {
  let [year, month, day] = currentDate.split("-");

  switch (listType) {
    case "year":
      year = selectedText;
      break;
    case "month":
      const monthIndex =
        MONTHS.indexOf(selectedText as (typeof MONTHS)[number]) + 1;
      month = (monthIndex || 0).toString().padStart(2, "0");
      break;
    case "day":
      day = selectedText;
      break;
  }

  const maxDays = new Date(Number(year), Number(month), 0).getDate();
  day = Math.min(Number(day), maxDays).toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * format date from YYYY-MM-DD to MM/DD/YYYY
 * @param dateString - date in YYYY-MM-DD format
 * @returns date in MM/DD/YYYY format, or empty string if invalid
 */
export function formatDateForDisplay(dateString: string): string {
  if (!dateString || typeof dateString !== "string") {
    return "";
  }

  const dateParts = dateString.split("-");
  if (dateParts.length !== 3) {
    return "";
  }

  const [year, month, day] = dateParts;
  return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
}

/**
 * map dropdown selected text to appropriate JSON value
 * @param listType - the dropdown type
 * @param selectedText - the selected dropdown text
 * @returns the JSON value to store, or null for deletion
 */
export function mapDropdownValueToKey(
  listType: string,
  selectedText: string,
): string | null {
  switch (listType) {
    case "location":
      return selectedText;
    case "sex":
      return (
        Object.entries(SEXES).find(
          (entry) => entry[1].label === selectedText,
        )?.[0] ?? ""
      );
    case "race#1":
    case "race#2":
      return (
        Object.entries(RACES).find(
          (entry) => entry[1].label === selectedText,
        )?.[0] ?? ""
      );
    case "ethnicity":
      return (
        Object.entries(ETHNICITIES).find(
          (entry) => entry[1].label === selectedText,
        )?.[0] ?? ""
      );
    case "eye_color":
      return (
        Object.entries(EYE_COLORS).find(
          (entry) => entry[1].label === selectedText,
        )?.[0] ?? ""
      );
    case "hair_color":
      return (
        Object.entries(HAIR_COLORS).find(
          (entry) => entry[1].label === selectedText,
        )?.[0] ?? ""
      );
    default:
      return "";
  }
}

/**
 * check if a field should be deleted based on its value
 * @param value - the mapped value
 * @param listType - optional list type for context-specific deletion rules
 * @returns true if field should be deleted
 */
export function shouldDeleteField(
  value: string | null,
  listType?: string,
): boolean | undefined {
  return value === null || (listType?.startsWith("race") && value === "none");
}

/**
 * handle race mutual exclusivity logic
 * @param runtime - C3 runtime instance (JSON)
 * @param changingRace - which race dropdown is being changed (race#1 or race#2)
 * @param value - the new value being set (null for N/A)
 */
export function handleRaceMutualExclusivity(
  runtime: any,
  changingRace: string,
  value: string | null,
): void {
  if (value === null && changingRace.startsWith("race")) {
    const otherRacePath =
      changingRace === "race#1"
        ? "character_data.info.race.1"
        : "character_data.info.race.0";

    const otherRaceValue = getJSONValue(runtime, otherRacePath);
    if (!otherRaceValue || otherRaceValue === "none") {
      deleteJSONValue(runtime, otherRacePath);
    }
  }
}

/**
 * prevent tabbing, when login screen is active
 */
export function preventTab(e: KeyboardEvent) {
  if (e.key === "Tab") e.preventDefault();
}
