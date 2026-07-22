import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaJobApplicationDao } from "../../src/dao/jobApplicationDao";

const upsertMock = vi.hoisted(() => vi.fn());
const findUniqueMock = vi.hoisted(() => vi.fn());
const getPrismaClientMock = vi.hoisted(() =>
	vi.fn(() => ({
		jobApplication: {
			upsert: upsertMock,
			findUnique: findUniqueMock,
		},
	})),
);

vi.mock("../../src/prismaClient", () => ({
	getPrismaClient: getPrismaClientMock,
}));

describe("job application dao", () => {
	beforeEach(() => {
		upsertMock.mockReset();
		findUniqueMock.mockReset();
		getPrismaClientMock.mockClear();
	});

	it("upserts and maps a job application record", async () => {
		const dao = new PrismaJobApplicationDao();
		upsertMock.mockResolvedValue({
			id: 5,
			jobRoleId: 1,
			applicantId: "user-1",
			status: "in_progress",
			cvS3Key: "cvs/1/user-1/cv.pdf",
			cvFileName: "cv.pdf",
			cvMimeType: "application/pdf",
			cvSizeBytes: 1234,
			createdAt: new Date("2026-07-15T10:00:00.000Z"),
			updatedAt: new Date("2026-07-15T11:00:00.000Z"),
		});

		const result = await dao.upsert({
			jobRoleId: 1,
			applicantId: "user-1",
			status: "in_progress",
			cvS3Key: "cvs/1/user-1/cv.pdf",
			cvFileName: "cv.pdf",
			cvMimeType: "application/pdf",
			cvSizeBytes: 1234,
		});

		expect(getPrismaClientMock).toHaveBeenCalledTimes(1);
		expect(upsertMock).toHaveBeenCalledWith({
			where: {
				jobRoleId_applicantId: {
					jobRoleId: 1,
					applicantId: "user-1",
				},
			},
			update: {
				status: "in_progress",
				cvS3Key: "cvs/1/user-1/cv.pdf",
				cvFileName: "cv.pdf",
				cvMimeType: "application/pdf",
				cvSizeBytes: 1234,
			},
			create: {
				jobRoleId: 1,
				applicantId: "user-1",
				status: "in_progress",
				cvS3Key: "cvs/1/user-1/cv.pdf",
				cvFileName: "cv.pdf",
				cvMimeType: "application/pdf",
				cvSizeBytes: 1234,
			},
		});
		expect(result).toMatchObject({
			id: 5,
			jobRoleId: 1,
			applicantId: "user-1",
			status: "in_progress",
			cvFileName: "cv.pdf",
		});
	});

	it("returns null when no record exists for applicant and role", async () => {
		const dao = new PrismaJobApplicationDao();
		findUniqueMock.mockResolvedValue(null);

		const result = await dao.findByJobRoleAndApplicant(10, "user-x");

		expect(findUniqueMock).toHaveBeenCalledWith({
			where: {
				jobRoleId_applicantId: {
					jobRoleId: 10,
					applicantId: "user-x",
				},
			},
		});
		expect(result).toBeNull();
	});

	it("maps record when application exists for applicant and role", async () => {
		const dao = new PrismaJobApplicationDao();
		findUniqueMock.mockResolvedValue({
			id: 99,
			jobRoleId: 77,
			applicantId: "user-y",
			status: "submitted",
			cvS3Key: "cvs/77/user-y/cv.pdf",
			cvFileName: "cv.pdf",
			cvMimeType: "application/pdf",
			cvSizeBytes: 1500,
			createdAt: new Date("2026-07-01T10:00:00.000Z"),
			updatedAt: new Date("2026-07-01T10:10:00.000Z"),
		});

		const result = await dao.findByJobRoleAndApplicant(77, "user-y");

		expect(result).not.toBeNull();
		expect(result).toMatchObject({
			id: 99,
			jobRoleId: 77,
			applicantId: "user-y",
			status: "submitted",
		});
	});
});
