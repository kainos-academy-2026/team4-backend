import type { Role } from "../Auth/role";

export interface User {
	id: number;
	email: string;
	password: string;
	role: Role;
}
