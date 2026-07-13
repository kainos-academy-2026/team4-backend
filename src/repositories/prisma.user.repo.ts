// Talks to Database - finds user row by email
import type { PrismaClient } from "@prisma/client";
import type User from "../Models/user.model";
import type UserRepository from "./user.repo";

export default class PrismaUserRepository implements UserRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findByEmail(email: string): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: { email },
		});
	}
}
