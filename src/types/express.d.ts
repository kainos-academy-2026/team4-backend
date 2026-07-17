import type { Role } from "../Auth/role";

declare global {
	namespace Express {
		interface Request {
			authUser?: {
				id: string;
				email: string;
				role: Role;
			};
		}
	}
}
