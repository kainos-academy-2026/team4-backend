import type { PrismaClient } from "@prisma/client";

import { getPrismaClient } from "./prismaClient";

type SeedPrismaClient = Pick<
	PrismaClient,
	"capability" | "band" | "jobRole" | "$disconnect"
>;

type SeedSummary = {
	capabilities: number;
	bands: number;
	jobRoles: number;
};

const capabilities = [
	{ id: 1, capabilityName: "Engineering" },
	{ id: 2, capabilityName: "Design" },
	{ id: 3, capabilityName: "Quality" },
];

const bands = [
	{ id: 1, bandName: "B1" },
	{ id: 2, bandName: "B2" },
	{ id: 3, bandName: "B3" },
];

export const seedDatabase = async (
	prisma: SeedPrismaClient,
): Promise<SeedSummary> => {
	const seededCapabilities = await Promise.all(
		capabilities.map((capability) =>
			prisma.capability.upsert({
				where: { id: capability.id },
				update: capability,
				create: capability,
			}),
		),
	);

	const seededBands = await Promise.all(
		bands.map((band) =>
			prisma.band.upsert({
				where: { id: band.id },
				update: band,
				create: band,
			}),
		),
	);

	await prisma.jobRole.upsert({
		where: { id: 1 },
		update: {
			roleName: "Backend Engineer",
			location: "Manchester",
			capabilityId: seededCapabilities[0].id,
			bandId: seededBands[1].id,
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
			capabilityId: seededCapabilities[0].id,
			bandId: seededBands[1].id,
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
			capabilityId: seededCapabilities[1].id,
			bandId: seededBands[2].id,
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
			capabilityId: seededCapabilities[1].id,
			bandId: seededBands[2].id,
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
			capabilityId: seededCapabilities[2].id,
			bandId: seededBands[0].id,
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
			capabilityId: seededCapabilities[2].id,
			bandId: seededBands[0].id,
			closingDate: new Date("2026-08-20T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking a QA Analyst to join our Quality capability. You will ensure software meets the highest standards by defining test strategies and identifying defects early in the development lifecycle.",
			responsibilities:
				"Write and execute manual and automated test cases. Raise and track defects through to resolution. Contribute to acceptance criteria definition. Support continuous improvement of QA processes.",
			numberOfOpenPositions: 3,
		},
	});

	return {
		capabilities: seededCapabilities.length,
		bands: seededBands.length,
		jobRoles: 3,
	};
};

export const runSeed = async (): Promise<void> => {
	const prisma = getPrismaClient();

	try {
		const summary = await seedDatabase(prisma);
		console.info(
			`Seeded ${summary.capabilities} capabilities, ${summary.bands} bands, and ${summary.jobRoles} job roles.`,
		);
	} catch (error: unknown) {
		console.error("Database seed failed.");
		console.error(error);
		process.exitCode = 1;
	} finally {
		await prisma.$disconnect();
	}
};
