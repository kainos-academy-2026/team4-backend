import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
		},
		create: {
			id: 1,
			roleName: "Backend Engineer",
			location: "Manchester",
			capabilityId: engineering.id,
			bandId: b2.id,
			closingDate: new Date("2026-08-01T00:00:00.000Z"),
			status: "Open",
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
		},
		create: {
			id: 2,
			roleName: "Product Designer",
			location: "London",
			capabilityId: design.id,
			bandId: b3.id,
			closingDate: new Date("2026-08-15T00:00:00.000Z"),
			status: "Open",
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
		},
		create: {
			id: 3,
			roleName: "QA Analyst",
			location: "Remote",
			capabilityId: quality.id,
			bandId: b1.id,
			closingDate: new Date("2026-08-20T00:00:00.000Z"),
			status: "Open",
		},
	});
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
