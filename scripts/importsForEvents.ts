import * as API from "./index.js";

// config
export const configureApi = API.configureApi;
export const setAuthToken = API.setAuthToken;
export const clearAuthToken = API.clearAuthToken;
export const getAuthToken = API.getAuthToken;
export const isAuthenticated = API.isAuthenticated;
export const initializeAuth = API.initializeAuth;
export const addAuthStateListener = API.addAuthStateListener;

// auth
export const authenticateNewgrounds = API.authenticateNewgrounds;
export const getItchOAuthUrl = API.getItchOAuthUrl;
export const getGoogleOAuthUrl = API.getGoogleOAuthUrl;
export const verifySession = API.verifySession;
export const getCurrentUser = API.getCurrentUser;
export const logout = API.logout;
export const isLoggedIn = API.isLoggedIn;
export const handleOAuthPopup = API.handleOAuthPopup;
export const loginWithItch = API.loginWithItch;
export const loginWithGoogle = API.loginWithGoogle;

// characters
export const getUserCharacter = API.getUserCharacter;
export const uploadCharacter = API.uploadCharacter;
export const updateUserCharacter = API.updateUserCharacter;
export const getPlazaCharacters = API.getPlazaCharacters;
export const getCharacterById = API.getCharacterById;
export const hasCharacter = API.hasCharacter;
export const canEditCharacter = API.canEditCharacter;
export const getCharactersByCountry = API.getCharactersByCountry;
export const getRandomCharacters = API.getRandomCharacters;
export const validateCharacterData = API.validateCharacterData;
export const validateInputName = API.validateInputName;

// admin
export const listAllCharacters = API.listAllCharacters;
export const getCharacterDetails = API.getCharacterDetails;
export const deleteCharacter = API.deleteCharacter;
export const listAllUsers = API.listAllUsers;
export const getRecentCharacters = API.getRecentCharacters;
export const getDeletedCharacters = API.getDeletedCharacters;
export const getAdminStats = API.getAdminStats;
export const validateAdminAccess = API.validateAdminAccess;

// constants
export const CHARACTER_NAME_MAX_LENGTH = API.CHARACTER_NAME_MAX_LENGTH;
export const CHARACTER_NAME_REGEX = API.CHARACTER_NAME_REGEX;
export const CHARACTER_NAME_ERROR_MESSAGE = API.CHARACTER_NAME_ERROR_MESSAGE;
export const countries = API.COUNTRIES;
export const months = API.MONTHS;
export const sexes = API.SEXES;
export const races = API.RACES;
export const ethnicities = API.ETHNICITIES;
export const eye_colors = API.EYE_COLORS;
export const hair_colors = API.HAIR_COLORS;

// value arrays
export const SEX_VALUES = API.SEX_VALUES;
export const RACE_VALUES = API.RACE_VALUES;
export const ETHNICITY_VALUES = API.ETHNICITY_VALUES;
export const EYE_COLOR_VALUES = API.EYE_COLOR_VALUES;
export const HAIR_COLOR_VALUES = API.HAIR_COLOR_VALUES;

// utils
export const isValidCountry = API.isValidCountry;
export const validateCharacterName = API.validateCharacterName;
export const getJSONValue = API.getJSONValue;
export const setJSONValue = API.setJSONValue;
export const deleteJSONValue = API.deleteJSONValue;
export const buildDateFromComponents = API.buildDateFromComponents;
export const mapDropdownValueToKey = API.mapDropdownValueToKey;
export const shouldDeleteField = API.shouldDeleteField;
export const handleRaceMutualExclusivity = API.handleRaceMutualExclusivity;
export const preventTab = API.preventTab;

// main object
export const IdentikitAPI = API.IdentikitAPI;
