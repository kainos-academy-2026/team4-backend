import { describe, expect, it } from "vitest";
import { JobApplicationMapper } from "../../src/mappers/jobApplicationMapper";
import type { JobApplication } from "../../src/models/jobApplication";

describe("job application mapper", () => {
	it("maps a persistence record to JobApplication model", () => {
		const mapper = new JobApplicationMapper();
		const createdAt = new Date("2026-07-01T10:00:00.000Z");
		const updatedAt = new Date("2026-07-02T11:00:00.000Z");

		const result = mapper.toModel({
			id: 1,
			jobRoleId: 2,
			applicantId: "user-1",
			status: "in_progress",
			cvS3Key: "cvs/2/user-1/file.pdf",
			cvFileName: "file.pdf",
			cvMimeType: "application/pdf",
			cvSizeBytes: 2048,
			createdAt,
			updatedAt,
		});

		expect(result).toEqual({
			id: 1,
			jobRoleId: 2,
			applicantId: "user-1",
			status: "in_progress",
			cvS3Key: "cvs/2/user-1/file.pdf",
			cvFileName: "file.pdf",
			cvMimeType: "application/pdf",
			cvSizeBytes: 2048,
			createdAt,
			updatedAt,
		});
	});

	it("maps JobApplication model to response DTO", () => {
		const mapper = new JobApplicationMapper();
		const application: JobApplication = {
			id: 10,
			jobRoleId: 9,
			applicantId: "user-abc",
			status: "in_progress",
			cvS3Key: "cvs/9/user-abc/cv.pdf",
			cvFileName: "cv.pdf",
			cvMimeType: "application/pdf",
			cvSizeBytes: 1024,
			createdAt: new Date("2026-07-10T10:00:00.000Z"),
			updatedAt: new Date("2026-07-10T10:10:00.000Z"),
		};

		const result = mapper.toResponse(application);

		expect(result).toEqual({
			id: 10,
			jobRoleId: 9,
			applicantId: "user-abc",
			status: "in_progress",
			cvFileName: "cv.pdf",
		});
	});
});
