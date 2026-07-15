import type { Role } from "../Auth/role";
import type { User } from "../models/user";
import { getPrismaClient } from "../prismaClient";

export interface UserDao {
	findByEmail(email: string): Promise<User | null>;
	createUser(input: {
		email: string;
		password: string;
		role: Role;
	}): Promise<User>;
}

export class PrismaUserDao implements UserDao {
	public async findByEmail(email: string): Promise<User | null> {
		const prisma = getPrismaClient();
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			email: user.email,
			password: user.password,
			role: user.role as Role,
		};
	}

	public async createUser(input: {
		email: string;
		password: string;
		role: Role;
	}): Promise<User> {
		const prisma = getPrismaClient();
		const user = await prisma.user.create({
			data: {
				email: input.email,
				password: input.password,
				role: input.role,
			},
		});

		return {
			id: user.id,
			email: user.email,
			password: user.password,
			role: user.role as Role,
		};
	}
}
