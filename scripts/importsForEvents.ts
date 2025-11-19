import * as API from "./index.js";

// config
export const configureApi = API.configureApi;
export const setAuthToken = API.setAuthToken;
export const clearAuthToken = API.clearAuthToken;
export const getAuthToken = API.getAuthToken;
export const isAuthenticated = API.isAuthenticated;

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

// admin
export const listAllCharacters = API.listAllCharacters;
export const getCharacterDetails = API.getCharacterDetails;
export const deleteCharacter = API.deleteCharacter;
export const listAllUsers = API.listAllUsers;
export const getRecentCharacters = API.getRecentCharacters;
export const getDeletedCharacters = API.getDeletedCharacters;
export const getAdminStats = API.getAdminStats;
export const validateAdminAccess = API.validateAdminAccess;

// utils
export const isValidCountry = API.isValidCountry;
export const COUNTRIES = API.COUNTRIES;

// main object & init
export const IdentikitAPI = API.IdentikitAPI;
export const initializeIdentikitAPI = API.initializeIdentikitAPI;
