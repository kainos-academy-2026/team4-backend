export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL = "7d";

export const AUTH_COOKIE_NAMES = {
	refreshToken: "refresh_token",
	csrfToken: "csrf_token",
} as const;

export const AUTH_HEADER_PREFIX = "Bearer ";
