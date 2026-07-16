// Talks to Database - finds user row by email
import type { PrismaClient } from "@prisma/client";
import type User from "../models/userModel";
import type UserRepository from "./userRepo";

export default class PrismaUserRepository implements UserRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(email: string, passwordHash: string): Promise<User> {
		return await this.prisma.user.create({
			data: {
				email,
				passwordHash,
			},
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: { email },
		});
	}
}
