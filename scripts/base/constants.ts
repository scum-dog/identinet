export const COUNTRIES = [
  "Afghanistan",
  "Aland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua & Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "British Virgin Islands",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo, the Democratic Republic of the",
  "Cook Islands",
  "Costa Rica",
  "Cote D'ivoire (Ivory Coast)",
  "Croatia",
  "Cuba",
  "Curacao",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands (Malvinas)",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard & McDonald Islands",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iraq",
  "Ireland",
  "Islamic Republic of Iran",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, Democratic People's Republic of",
  "Korea, Republic of",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia, The Former Yugoslav Republic of",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia",
  "Moldova, Republic of",
  "Monaco",
  "Mongolia",
  "Monserrat",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestinian Territory, Occupied",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Barthelemy",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Samoa",
  "San Marino",
  "Sao Tome & Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St. Helena",
  "St. Kitts and Nevis",
  "St. Pierre & Miquelon",
  "St. Vincent & the Grenadines",
  "Sudan",
  "Suriname",
  "Svalbard & Jan Mayen Islands",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad & Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks & Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom (Great Britain)",
  "United States Minor Outlying",
  "United States Virgin Islands",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City State (Holy See)",
  "Venezuela",
  "Viet Nam",
  "Wallis & Futuna Islands",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
] as const;

export type Country = (typeof COUNTRIES)[number];

/**
 * checks if a given country is in the approved country list
 * @param country - country string to validate
 * @returns true if country is valid, false otherwise
 */
export function isValidCountry(country: string): boolean {
  return COUNTRIES.includes(country as Country);
}

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const SEXES = {
  male: "Male",
  female: "Female",
  other: "Other",
} as const;

export type Sex = keyof typeof SEXES;
export const SEX_VALUES = Object.keys(SEXES) as Sex[];

export const RACES = {
  ai_an: "American Indian or Alaska Native",
  asian: "Asian",
  black: "Black or African American",
  nh_pi: "Native Hawaiian or Other Pacific Islander",
  white: "White",
  other: "Other",
} as const;

export type Race = keyof typeof RACES;
export const RACE_VALUES = Object.keys(RACES) as Race[];

export const ETHNICITIES = {
  not_hispanic_latino: "Not Hispanic or Latino",
  hispanic_latino: "Hispanic or Latino",
} as const;

export type Ethnicity = keyof typeof ETHNICITIES;
export const ETHNICITY_VALUES = Object.keys(ETHNICITIES) as Ethnicity[];

export const EYE_COLORS = {
  black: "Black",
  blue: "Blue",
  brown: "Brown",
  gray: "Gray",
  green: "Green",
  hazel: "Hazel",
  maroon: "Maroon",
  pink: "Pink",
} as const;

export type EyeColor = keyof typeof EYE_COLORS;
export const EYE_COLOR_VALUES = Object.keys(EYE_COLORS) as EyeColor[];

export const HAIR_COLORS = {
  bald: "Bald",
  black: "Black",
  blond: "Blond",
  brown: "Brown",
  gray: "Gray",
  red: "Red",
  sandy: "Sandy",
  white: "White",
} as const;

export type HairColor = keyof typeof HAIR_COLORS;
export const HAIR_COLOR_VALUES = Object.keys(HAIR_COLORS) as HairColor[];

export const CHARACTER_NAME_MAX_LENGTH = 32;
export const CHARACTER_NAME_REGEX =
  /^(?=.*[A-Za-z])[A-Za-z]+(?:[' -][A-Za-z]+)*$/;
export const CHARACTER_NAME_ERROR_MESSAGE =
  "Name must start with a letter, contain only letters/spaces/hyphens/apostrophes, and have no consecutive punctuation or leading/trailing spaces";

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

  return { valid: true };
}

export const HEIGHT_MIN = 48;
export const HEIGHT_MAX = 96;

export const WEIGHT_MIN = 50;
export const WEIGHT_MAX = 500;

/**
 * sanitize text input to conform to type rules
 * @param runtime - C3 runtime instance
 * @returns sanitized text that conforms to type's rules
 */
export function validateTextInput(runtime: any): string {
  const input_type = runtime.instVars.type;
  const input_text = (runtime.getElement() as HTMLInputElement).value;

  if (!input_text || typeof input_text !== "string") {
    return "";
  }

  let sanitized = "";

  switch (input_type) {
    case "name":
      // remove all invalid characters
      sanitized = input_text.replace(/[^A-Za-z' -]/g, "");

      // remove leading non-letters
      sanitized = sanitized.replace(/^[^A-Za-z]+/, "");

      // remove consecutive punctuation
      sanitized = sanitized.replace(/([' -])[' -]+/g, "$1");

      // trim leading/trailing whitespace
      //sanitized = sanitized.trim();

      // truncate to max length
      if (sanitized.length > CHARACTER_NAME_MAX_LENGTH) {
        sanitized = sanitized.substring(0, CHARACTER_NAME_MAX_LENGTH).trim();
      }

      // if no letters remain, return empty string
      if (!/[A-Za-z]/.test(sanitized)) {
        return "";
      }

      break;
    case "day":
    case "year":
    case "height":
    case "weight":
      sanitized = input_text.replace(/[^0-9]/g, "");

      // TEMP
      if (input_type === "day") {
        const day = parseInt(sanitized, 10);
        if (!isNaN(day)) {
          sanitized = Math.min(Math.max(day, 1), 31).toString();
        }
      }

      break;
    default:
      break;
  }

  return sanitized;
}
