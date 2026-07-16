import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const isTrue = (value: string | undefined): boolean => {
	if (!value) {
		return false;
	}

	return value.trim().toLowerCase() === "true";
};

const getEnv = (name: string, fallback: string): string => {
	const value = process.env[name]?.trim();
	return value && value.length > 0 ? value : fallback;
};

const seedAuthUser = async (input: {
	email: string;
	password: string;
	role: "admin" | "user";
}): Promise<void> => {
	await prisma.user.upsert({
		where: { email: input.email.trim().toLowerCase() },
		update: {
			password: input.password,
			role: input.role,
		},
		create: {
			email: input.email.trim().toLowerCase(),
			password: input.password,
			role: input.role,
		},
	});
};

async function main(): Promise<void> {
	const engineering = await prisma.capability.upsert({
		where: { id: 1 },
		update: { capabilityName: "Engineering" },
		create: { id: 1, capabilityName: "Engineering" },
	});

	const design = await prisma.capability.upsert({
		where: { id: 2 },
		update: { capabilityName: "Design" },
		create: { id: 2, capabilityName: "Design" },
	});

	const quality = await prisma.capability.upsert({
		where: { id: 3 },
		update: { capabilityName: "Quality" },
		create: { id: 3, capabilityName: "Quality" },
	});

	const b1 = await prisma.band.upsert({
		where: { id: 1 },
		update: { bandName: "B1" },
		create: { id: 1, bandName: "B1" },
	});

	const b2 = await prisma.band.upsert({
		where: { id: 2 },
		update: { bandName: "B2" },
		create: { id: 2, bandName: "B2" },
	});

	const b3 = await prisma.band.upsert({
		where: { id: 3 },
		update: { bandName: "B3" },
		create: { id: 3, bandName: "B3" },
	});

	await prisma.jobRole.upsert({
		where: { id: 1 },
		update: {
			roleName: "Backend Engineer",
			location: "Manchester",
			capabilityId: engineering.id,
			bandId: b2.id,
			closingDate: new Date("2026-08-01T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Backend Engineer to join our growing Engineering capability. You will design, build, and maintain scalable server-side services and APIs that power our products.",
			responsibilities:
				"Design and implement RESTful APIs. Collaborate with frontend engineers and product teams. Write unit and integration tests. Participate in code reviews and contribute to technical standards.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/backend-engineer",
			numberOfOpenPositions: 2,
		},
		create: {
			id: 1,
			roleName: "Backend Engineer",
			location: "Manchester",
			capabilityId: engineering.id,
			bandId: b2.id,
			closingDate: new Date("2026-08-01T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Backend Engineer to join our growing Engineering capability. You will design, build, and maintain scalable server-side services and APIs that power our products.",
			responsibilities:
				"Design and implement RESTful APIs. Collaborate with frontend engineers and product teams. Write unit and integration tests. Participate in code reviews and contribute to technical standards.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/backend-engineer",
			numberOfOpenPositions: 2,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 2 },
		update: {
			roleName: "Product Designer",
			location: "London",
			capabilityId: design.id,
			bandId: b3.id,
			closingDate: new Date("2026-08-15T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Design capability as a Product Designer. You will craft intuitive user experiences by working closely with engineers and stakeholders to translate requirements into polished interfaces.",
			responsibilities:
				"Create wireframes, prototypes, and high-fidelity designs. Conduct user research and usability testing. Define design systems and maintain component libraries. Collaborate in agile delivery teams.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/product-designer",
			numberOfOpenPositions: 1,
		},
		create: {
			id: 2,
			roleName: "Product Designer",
			location: "London",
			capabilityId: design.id,
			bandId: b3.id,
			closingDate: new Date("2026-08-15T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Design capability as a Product Designer. You will craft intuitive user experiences by working closely with engineers and stakeholders to translate requirements into polished interfaces.",
			responsibilities:
				"Create wireframes, prototypes, and high-fidelity designs. Conduct user research and usability testing. Define design systems and maintain component libraries. Collaborate in agile delivery teams.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/product-designer",
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 3 },
		update: {
			roleName: "QA Analyst",
			location: "Remote",
			capabilityId: quality.id,
			bandId: b1.id,
			closingDate: new Date("2026-08-20T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking a QA Analyst to join our Quality capability. You will ensure software meets the highest standards by defining test strategies and identifying defects early in the development lifecycle.",
			responsibilities:
				"Write and execute manual and automated test cases. Raise and track defects through to resolution. Contribute to acceptance criteria definition. Support continuous improvement of QA processes.",
			numberOfOpenPositions: 3,
		},
		create: {
			id: 3,
			roleName: "QA Analyst",
			location: "Remote",
			capabilityId: quality.id,
			bandId: b1.id,
			closingDate: new Date("2026-08-20T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking a QA Analyst to join our Quality capability. You will ensure software meets the highest standards by defining test strategies and identifying defects early in the development lifecycle.",
			responsibilities:
				"Write and execute manual and automated test cases. Raise and track defects through to resolution. Contribute to acceptance criteria definition. Support continuous improvement of QA processes.",
			numberOfOpenPositions: 3,
		},
	});
	const enableDevTestUser = isTrue(process.env.ENABLE_DEV_TEST_USER);
	const nodeEnv = process.env.NODE_ENV?.trim();

	// Safety: seed known test logins only when NODE_ENV is explicitly development.
	if (enableDevTestUser && nodeEnv !== "development") {
		throw new Error(
			"ENABLE_DEV_TEST_USER requires NODE_ENV=development (explicitly set)",
		);
	}

	// In local dev, this creates/updates the two login accounts we need.
	if (nodeEnv === "development" && enableDevTestUser) {
		const applicantEmail = getEnv("TEST_USER_EMAIL", "test@example.com");
		const applicantPassword = getEnv("TEST_USER_PASSWORD", "Password123!");
		const adminEmail = getEnv("TEST_ADMIN_EMAIL", "admin@example.com");
		const adminPassword = getEnv("TEST_ADMIN_PASSWORD", "AdminPassword123!");

		await seedAuthUser({
			email: applicantEmail,
			password: applicantPassword,
			role: "user",
		});

		await seedAuthUser({
			email: adminEmail,
			password: adminPassword,
			role: "admin",
		});

		console.log(`Seeded auth users: ${applicantEmail}, ${adminEmail}`);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error: unknown) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
