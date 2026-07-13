import "dotenv/config";
import { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient | null = null;

export const getPrismaClient = (): PrismaClient => {
	if (prismaClient !== null) {
		return prismaClient;
	}

	const connectionString = process.env.DATABASE_URL?.trim();
	if (!connectionString) {
		throw new Error("DATABASE_URL is required to initialize PrismaClient");
	}

	prismaClient = new PrismaClient({
		datasources: { db: { url: connectionString } },
	});

	return prismaClient;
};
