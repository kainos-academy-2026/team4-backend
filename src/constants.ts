export const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL?.trim() || "15m";
export const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL?.trim() || "7d";

export const AUTH_HEADER_PREFIX = "Bearer ";
