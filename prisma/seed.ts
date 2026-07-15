import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const getEnv = (name: string, fallback: string): string => {
	const value = process.env[name];
	if (!value?.trim()) {
		return fallback;
	}

	return value;
};

const isTrue = (value: string | undefined): boolean => value === "true";

const seedAuthUser = async (input: {
	email: string;
	password: string;
	role: "user" | "admin";
}): Promise<void> => {
	const passwordHash = await argon2.hash(input.password);

	// Keep login data stable for local testing.
	await prisma.user.upsert({
		where: { email: input.email },
		update: {
			role: input.role,
			passwordHash,
		},
		create: {
			email: input.email,
			role: input.role,
			passwordHash,
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

	const data = await prisma.capability.upsert({
		where: { id: 4 },
		update: { capabilityName: "Data & Analytics" },
		create: { id: 4, capabilityName: "Data & Analytics" },
	});

	const cloud = await prisma.capability.upsert({
		where: { id: 5 },
		update: { capabilityName: "Cloud & Infrastructure" },
		create: { id: 5, capabilityName: "Cloud & Infrastructure" },
	});

	const security = await prisma.capability.upsert({
		where: { id: 6 },
		update: { capabilityName: "Cyber Security" },
		create: { id: 6, capabilityName: "Cyber Security" },
	});

	const delivery = await prisma.capability.upsert({
		where: { id: 7 },
		update: { capabilityName: "Delivery Management" },
		create: { id: 7, capabilityName: "Delivery Management" },
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

	const b4 = await prisma.band.upsert({
		where: { id: 4 },
		update: { bandName: "B4" },
		create: { id: 4, bandName: "B4" },
	});

	const b5 = await prisma.band.upsert({
		where: { id: 5 },
		update: { bandName: "B5" },
		create: { id: 5, bandName: "B5" },
	});

	const b6 = await prisma.band.upsert({
		where: { id: 6 },
		update: { bandName: "B6" },
		create: { id: 6, bandName: "B6" },
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

	await prisma.jobRole.upsert({
		where: { id: 4 },
		update: {
			roleName: "Frontend Engineer",
			location: "Belfast",
			capabilityId: engineering.id,
			bandId: b2.id,
			closingDate: new Date("2026-09-01T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Frontend Engineer to build fast, accessible web applications using modern frameworks. You will work closely with designers and backend engineers to deliver great user experiences.",
			responsibilities:
				"Build responsive UIs using React and TypeScript. Optimise performance and accessibility. Collaborate with UX designers. Write unit and end-to-end tests. Contribute to front-end standards and code reviews.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/frontend-engineer",
			numberOfOpenPositions: 2,
		},
		create: {
			id: 4,
			roleName: "Frontend Engineer",
			location: "Belfast",
			capabilityId: engineering.id,
			bandId: b2.id,
			closingDate: new Date("2026-09-01T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Frontend Engineer to build fast, accessible web applications using modern frameworks. You will work closely with designers and backend engineers to deliver great user experiences.",
			responsibilities:
				"Build responsive UIs using React and TypeScript. Optimise performance and accessibility. Collaborate with UX designers. Write unit and end-to-end tests. Contribute to front-end standards and code reviews.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/frontend-engineer",
			numberOfOpenPositions: 2,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 5 },
		update: {
			roleName: "Senior Software Engineer",
			location: "Edinburgh",
			capabilityId: engineering.id,
			bandId: b4.id,
			closingDate: new Date("2026-09-15T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking a Senior Software Engineer to lead technical delivery across complex, high-impact projects. You will mentor junior engineers and help define engineering practices.",
			responsibilities:
				"Lead technical design and architecture decisions. Mentor and coach junior engineers. Drive code quality through reviews and pairing. Collaborate with architects and product owners to shape delivery.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/senior-software-engineer",
			numberOfOpenPositions: 1,
		},
		create: {
			id: 5,
			roleName: "Senior Software Engineer",
			location: "Edinburgh",
			capabilityId: engineering.id,
			bandId: b4.id,
			closingDate: new Date("2026-09-15T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking a Senior Software Engineer to lead technical delivery across complex, high-impact projects. You will mentor junior engineers and help define engineering practices.",
			responsibilities:
				"Lead technical design and architecture decisions. Mentor and coach junior engineers. Drive code quality through reviews and pairing. Collaborate with architects and product owners to shape delivery.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/senior-software-engineer",
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 6 },
		update: {
			roleName: "UX Researcher",
			location: "London",
			capabilityId: design.id,
			bandId: b2.id,
			closingDate: new Date("2026-08-28T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Design capability as a UX Researcher. You will uncover user needs through qualitative and quantitative research, informing the direction of our digital products and services.",
			responsibilities:
				"Plan and conduct user interviews, surveys, and usability testing. Synthesise findings into actionable insights. Present research to stakeholders. Advocate for users throughout the design process.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/ux-researcher",
			numberOfOpenPositions: 1,
		},
		create: {
			id: 6,
			roleName: "UX Researcher",
			location: "London",
			capabilityId: design.id,
			bandId: b2.id,
			closingDate: new Date("2026-08-28T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Design capability as a UX Researcher. You will uncover user needs through qualitative and quantitative research, informing the direction of our digital products and services.",
			responsibilities:
				"Plan and conduct user interviews, surveys, and usability testing. Synthesise findings into actionable insights. Present research to stakeholders. Advocate for users throughout the design process.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/ux-researcher",
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 7 },
		update: {
			roleName: "Lead QA Engineer",
			location: "Manchester",
			capabilityId: quality.id,
			bandId: b4.id,
			closingDate: new Date("2026-09-30T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Lead QA Engineer to own the quality strategy across multiple delivery teams. You will define test automation standards and mentor QA engineers.",
			responsibilities:
				"Define and implement test automation frameworks. Coach and mentor QA team members. Establish quality gates in CI/CD pipelines. Collaborate with delivery leads to ensure quality is built in from the start.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/lead-qa-engineer",
			numberOfOpenPositions: 1,
		},
		create: {
			id: 7,
			roleName: "Lead QA Engineer",
			location: "Manchester",
			capabilityId: quality.id,
			bandId: b4.id,
			closingDate: new Date("2026-09-30T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Lead QA Engineer to own the quality strategy across multiple delivery teams. You will define test automation standards and mentor QA engineers.",
			responsibilities:
				"Define and implement test automation frameworks. Coach and mentor QA team members. Establish quality gates in CI/CD pipelines. Collaborate with delivery leads to ensure quality is built in from the start.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/lead-qa-engineer",
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 8 },
		update: {
			roleName: "Data Engineer",
			location: "Remote",
			capabilityId: data.id,
			bandId: b3.id,
			closingDate: new Date("2026-09-10T00:00:00.000Z"),
			status: "Open",
			description:
				"We are hiring a Data Engineer to design and build robust data pipelines that power analytics and business intelligence. You will work with cloud-native data tools to process large volumes of data.",
			responsibilities:
				"Design and maintain scalable data pipelines. Work with data warehouses and lakes. Collaborate with data scientists and analysts. Ensure data quality, reliability, and governance.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/data-engineer",
			numberOfOpenPositions: 2,
		},
		create: {
			id: 8,
			roleName: "Data Engineer",
			location: "Remote",
			capabilityId: data.id,
			bandId: b3.id,
			closingDate: new Date("2026-09-10T00:00:00.000Z"),
			status: "Open",
			description:
				"We are hiring a Data Engineer to design and build robust data pipelines that power analytics and business intelligence. You will work with cloud-native data tools to process large volumes of data.",
			responsibilities:
				"Design and maintain scalable data pipelines. Work with data warehouses and lakes. Collaborate with data scientists and analysts. Ensure data quality, reliability, and governance.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/data-engineer",
			numberOfOpenPositions: 2,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 9 },
		update: {
			roleName: "Data Scientist",
			location: "Birmingham",
			capabilityId: data.id,
			bandId: b3.id,
			closingDate: new Date("2026-10-01T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Data & Analytics capability as a Data Scientist. You will develop machine learning models and statistical analyses that help our clients make better data-driven decisions.",
			responsibilities:
				"Build and evaluate ML models. Analyse large datasets to extract insights. Communicate findings clearly to non-technical stakeholders. Collaborate with engineers to deploy models into production.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/data-scientist",
			numberOfOpenPositions: 1,
		},
		create: {
			id: 9,
			roleName: "Data Scientist",
			location: "Birmingham",
			capabilityId: data.id,
			bandId: b3.id,
			closingDate: new Date("2026-10-01T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Data & Analytics capability as a Data Scientist. You will develop machine learning models and statistical analyses that help our clients make better data-driven decisions.",
			responsibilities:
				"Build and evaluate ML models. Analyse large datasets to extract insights. Communicate findings clearly to non-technical stakeholders. Collaborate with engineers to deploy models into production.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/data-scientist",
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 10 },
		update: {
			roleName: "Cloud Engineer",
			location: "Remote",
			capabilityId: cloud.id,
			bandId: b3.id,
			closingDate: new Date("2026-09-20T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Cloud Engineer to design, build, and operate cloud infrastructure for our clients. You will work primarily on AWS and Azure, enabling teams to deliver software faster and more reliably.",
			responsibilities:
				"Design and implement cloud infrastructure using Infrastructure as Code. Support CI/CD pipelines. Monitor and optimise cloud costs. Implement security and compliance controls in cloud environments.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/cloud-engineer",
			numberOfOpenPositions: 3,
		},
		create: {
			id: 10,
			roleName: "Cloud Engineer",
			location: "Remote",
			capabilityId: cloud.id,
			bandId: b3.id,
			closingDate: new Date("2026-09-20T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Cloud Engineer to design, build, and operate cloud infrastructure for our clients. You will work primarily on AWS and Azure, enabling teams to deliver software faster and more reliably.",
			responsibilities:
				"Design and implement cloud infrastructure using Infrastructure as Code. Support CI/CD pipelines. Monitor and optimise cloud costs. Implement security and compliance controls in cloud environments.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/cloud-engineer",
			numberOfOpenPositions: 3,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 11 },
		update: {
			roleName: "Senior Cloud Architect",
			location: "London",
			capabilityId: cloud.id,
			bandId: b5.id,
			closingDate: new Date("2026-10-15T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking a Senior Cloud Architect to lead cloud strategy and architecture for large-scale government and enterprise programmes. You will be a trusted advisor to clients and internal teams.",
			responsibilities:
				"Define cloud architecture strategies and reference architectures. Lead cloud adoption and migration programmes. Ensure security and resilience in architectural decisions. Mentor cloud engineers and contribute to Kainos' cloud community of practice.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/senior-cloud-architect",
			numberOfOpenPositions: 1,
		},
		create: {
			id: 11,
			roleName: "Senior Cloud Architect",
			location: "London",
			capabilityId: cloud.id,
			bandId: b5.id,
			closingDate: new Date("2026-10-15T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking a Senior Cloud Architect to lead cloud strategy and architecture for large-scale government and enterprise programmes. You will be a trusted advisor to clients and internal teams.",
			responsibilities:
				"Define cloud architecture strategies and reference architectures. Lead cloud adoption and migration programmes. Ensure security and resilience in architectural decisions. Mentor cloud engineers and contribute to Kainos' cloud community of practice.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/senior-cloud-architect",
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 12 },
		update: {
			roleName: "Security Consultant",
			location: "Belfast",
			capabilityId: security.id,
			bandId: b3.id,
			closingDate: new Date("2026-09-05T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Cyber Security capability as a Security Consultant. You will advise clients on security strategy, conduct assessments, and help teams embed security into software delivery.",
			responsibilities:
				"Conduct security assessments and penetration testing. Advise clients on security architecture and risk. Embed secure development practices in delivery teams. Produce clear, actionable security reports.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/security-consultant",
			numberOfOpenPositions: 2,
		},
		create: {
			id: 12,
			roleName: "Security Consultant",
			location: "Belfast",
			capabilityId: security.id,
			bandId: b3.id,
			closingDate: new Date("2026-09-05T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Cyber Security capability as a Security Consultant. You will advise clients on security strategy, conduct assessments, and help teams embed security into software delivery.",
			responsibilities:
				"Conduct security assessments and penetration testing. Advise clients on security architecture and risk. Embed secure development practices in delivery teams. Produce clear, actionable security reports.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/security-consultant",
			numberOfOpenPositions: 2,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 13 },
		update: {
			roleName: "Security Engineer",
			location: "Remote",
			capabilityId: security.id,
			bandId: b2.id,
			closingDate: new Date("2026-08-25T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Security Engineer to build and maintain security tooling and controls across our platforms. You will partner with engineering teams to identify and remediate vulnerabilities.",
			responsibilities:
				"Implement and maintain security controls in CI/CD and cloud environments. Triage and remediate vulnerabilities. Develop security automation and tooling. Support incident response activities.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/security-engineer",
			numberOfOpenPositions: 2,
		},
		create: {
			id: 13,
			roleName: "Security Engineer",
			location: "Remote",
			capabilityId: security.id,
			bandId: b2.id,
			closingDate: new Date("2026-08-25T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Security Engineer to build and maintain security tooling and controls across our platforms. You will partner with engineering teams to identify and remediate vulnerabilities.",
			responsibilities:
				"Implement and maintain security controls in CI/CD and cloud environments. Triage and remediate vulnerabilities. Develop security automation and tooling. Support incident response activities.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/security-engineer",
			numberOfOpenPositions: 2,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 14 },
		update: {
			roleName: "Delivery Manager",
			location: "Glasgow",
			capabilityId: delivery.id,
			bandId: b4.id,
			closingDate: new Date("2026-09-25T00:00:00.000Z"),
			status: "Open",
			description:
				"We are hiring a Delivery Manager to lead agile delivery teams in building and shipping high-quality digital services. You will be accountable for delivery outcomes and team performance.",
			responsibilities:
				"Facilitate agile ceremonies and remove blockers. Manage risks, dependencies, and stakeholder expectations. Track and report on delivery progress. Coach teams on agile practices and continuous improvement.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/delivery-manager",
			numberOfOpenPositions: 2,
		},
		create: {
			id: 14,
			roleName: "Delivery Manager",
			location: "Glasgow",
			capabilityId: delivery.id,
			bandId: b4.id,
			closingDate: new Date("2026-09-25T00:00:00.000Z"),
			status: "Open",
			description:
				"We are hiring a Delivery Manager to lead agile delivery teams in building and shipping high-quality digital services. You will be accountable for delivery outcomes and team performance.",
			responsibilities:
				"Facilitate agile ceremonies and remove blockers. Manage risks, dependencies, and stakeholder expectations. Track and report on delivery progress. Coach teams on agile practices and continuous improvement.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/delivery-manager",
			numberOfOpenPositions: 2,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 15 },
		update: {
			roleName: "Programme Manager",
			location: "London",
			capabilityId: delivery.id,
			bandId: b6.id,
			closingDate: new Date("2026-10-31T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking an experienced Programme Manager to oversee a portfolio of complex digital transformation programmes. You will manage senior client relationships and ensure programmes deliver value.",
			responsibilities:
				"Govern multiple concurrent delivery programmes. Build and maintain senior stakeholder relationships. Identify and manage programme-level risks and dependencies. Drive continuous improvement across delivery.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/programme-manager",
			numberOfOpenPositions: 1,
		},
		create: {
			id: 15,
			roleName: "Programme Manager",
			location: "London",
			capabilityId: delivery.id,
			bandId: b6.id,
			closingDate: new Date("2026-10-31T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking an experienced Programme Manager to oversee a portfolio of complex digital transformation programmes. You will manage senior client relationships and ensure programmes deliver value.",
			responsibilities:
				"Govern multiple concurrent delivery programmes. Build and maintain senior stakeholder relationships. Identify and manage programme-level risks and dependencies. Drive continuous improvement across delivery.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/programme-manager",
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 16 },
		update: {
			roleName: "Graduate Software Engineer",
			location: "Belfast",
			capabilityId: engineering.id,
			bandId: b1.id,
			closingDate: new Date("2026-08-10T00:00:00.000Z"),
			status: "Open",
			description:
				"Start your engineering career with Kainos. As a Graduate Software Engineer you will join a delivery team and contribute to real projects from day one, supported by experienced engineers and a structured development programme.",
			responsibilities:
				"Develop features under the guidance of senior engineers. Write clean, tested code. Participate in agile ceremonies. Engage with the Kainos graduate community and continuous learning opportunities.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/graduate-software-engineer",
			numberOfOpenPositions: 5,
		},
		create: {
			id: 16,
			roleName: "Graduate Software Engineer",
			location: "Belfast",
			capabilityId: engineering.id,
			bandId: b1.id,
			closingDate: new Date("2026-08-10T00:00:00.000Z"),
			status: "Open",
			description:
				"Start your engineering career with Kainos. As a Graduate Software Engineer you will join a delivery team and contribute to real projects from day one, supported by experienced engineers and a structured development programme.",
			responsibilities:
				"Develop features under the guidance of senior engineers. Write clean, tested code. Participate in agile ceremonies. Engage with the Kainos graduate community and continuous learning opportunities.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/graduate-software-engineer",
			numberOfOpenPositions: 5,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 17 },
		update: {
			roleName: "Platform Engineer",
			location: "Remote",
			capabilityId: cloud.id,
			bandId: b3.id,
			closingDate: new Date("2026-09-12T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Platform Engineer to build and maintain internal developer platforms that improve engineering productivity. You will work at the intersection of infrastructure, tooling, and developer experience.",
			responsibilities:
				"Build and operate developer platforms and tooling. Manage Kubernetes clusters and container infrastructure. Improve CI/CD tooling and deployment workflows. Champion developer experience across engineering teams.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/platform-engineer",
			numberOfOpenPositions: 2,
		},
		create: {
			id: 17,
			roleName: "Platform Engineer",
			location: "Remote",
			capabilityId: cloud.id,
			bandId: b3.id,
			closingDate: new Date("2026-09-12T00:00:00.000Z"),
			status: "Open",
			description:
				"We are looking for a Platform Engineer to build and maintain internal developer platforms that improve engineering productivity. You will work at the intersection of infrastructure, tooling, and developer experience.",
			responsibilities:
				"Build and operate developer platforms and tooling. Manage Kubernetes clusters and container infrastructure. Improve CI/CD tooling and deployment workflows. Champion developer experience across engineering teams.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/platform-engineer",
			numberOfOpenPositions: 2,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 18 },
		update: {
			roleName: "Service Designer",
			location: "London",
			capabilityId: design.id,
			bandId: b3.id,
			closingDate: new Date("2026-08-22T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Design capability as a Service Designer. You will map end-to-end service journeys, identify pain points, and work with multidisciplinary teams to reimagine how public and enterprise services are delivered.",
			responsibilities:
				"Map current and future-state service blueprints. Facilitate co-design workshops with users and stakeholders. Define service design principles and patterns. Work closely with product managers and engineers to realise design intent.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/service-designer",
			numberOfOpenPositions: 1,
		},
		create: {
			id: 18,
			roleName: "Service Designer",
			location: "London",
			capabilityId: design.id,
			bandId: b3.id,
			closingDate: new Date("2026-08-22T00:00:00.000Z"),
			status: "Open",
			description:
				"Join our Design capability as a Service Designer. You will map end-to-end service journeys, identify pain points, and work with multidisciplinary teams to reimagine how public and enterprise services are delivered.",
			responsibilities:
				"Map current and future-state service blueprints. Facilitate co-design workshops with users and stakeholders. Define service design principles and patterns. Work closely with product managers and engineers to realise design intent.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/service-designer",
			numberOfOpenPositions: 1,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 19 },
		update: {
			roleName: "Automation Test Engineer",
			location: "Edinburgh",
			capabilityId: quality.id,
			bandId: b2.id,
			closingDate: new Date("2026-09-08T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking an Automation Test Engineer to expand our test automation coverage and improve release confidence. You will work in an agile team delivering quality software for public sector clients.",
			responsibilities:
				"Develop and maintain automated test suites. Integrate tests into CI/CD pipelines. Investigate and report defects clearly. Contribute to test strategy alongside manual and performance testing colleagues.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/automation-test-engineer",
			numberOfOpenPositions: 2,
		},
		create: {
			id: 19,
			roleName: "Automation Test Engineer",
			location: "Edinburgh",
			capabilityId: quality.id,
			bandId: b2.id,
			closingDate: new Date("2026-09-08T00:00:00.000Z"),
			status: "Open",
			description:
				"We are seeking an Automation Test Engineer to expand our test automation coverage and improve release confidence. You will work in an agile team delivering quality software for public sector clients.",
			responsibilities:
				"Develop and maintain automated test suites. Integrate tests into CI/CD pipelines. Investigate and report defects clearly. Contribute to test strategy alongside manual and performance testing colleagues.",
			sharepointUrl:
				"https://kainos.sharepoint.com/job-roles/automation-test-engineer",
			numberOfOpenPositions: 2,
		},
	});

	await prisma.jobRole.upsert({
		where: { id: 20 },
		update: {
			roleName: "BI Analyst",
			location: "Birmingham",
			capabilityId: data.id,
			bandId: b2.id,
			closingDate: new Date("2026-09-18T00:00:00.000Z"),
			status: "Open",
			description:
				"We are hiring a BI Analyst to transform raw data into meaningful dashboards and reports that drive business decisions. You will work with stakeholders to understand reporting needs and deliver actionable insights.",
			responsibilities:
				"Develop dashboards in Power BI and other BI tools. Write complex SQL queries for data extraction and transformation. Work with data engineers to shape data models. Present insights clearly to non-technical audiences.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/bi-analyst",
			numberOfOpenPositions: 2,
		},
		create: {
			id: 20,
			roleName: "BI Analyst",
			location: "Birmingham",
			capabilityId: data.id,
			bandId: b2.id,
			closingDate: new Date("2026-09-18T00:00:00.000Z"),
			status: "Open",
			description:
				"We are hiring a BI Analyst to transform raw data into meaningful dashboards and reports that drive business decisions. You will work with stakeholders to understand reporting needs and deliver actionable insights.",
			responsibilities:
				"Develop dashboards in Power BI and other BI tools. Write complex SQL queries for data extraction and transformation. Work with data engineers to shape data models. Present insights clearly to non-technical audiences.",
			sharepointUrl: "https://kainos.sharepoint.com/job-roles/bi-analyst",
			numberOfOpenPositions: 2,
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
