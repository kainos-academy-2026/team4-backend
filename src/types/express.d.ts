import type { Role } from "../Auth/role";

declare global {
	namespace Express {
		interface Request {
			authUser?: {
				id: number;
				email: string;
				role: Role;
			};
		}
	}
}
