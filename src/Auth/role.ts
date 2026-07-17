export enum Role {
	Admin = "admin",
	User = "user",
}

export const isRole = (value: unknown): value is Role =>
	value === Role.Admin || value === Role.User;
