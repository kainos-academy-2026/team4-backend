import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobApplicationDao } from "../../src/dao/jobApplicationDao";
import type { JobRoleDao } from "../../src/dao/jobRoleDao";
import type { JobApplication } from "../../src/models/jobApplication";
import type { JobRole } from "../../src/models/jobRole";
import {
	JobApplicationService,
	JobNotFoundError,
	S3UploadError,
} from "../../src/services/jobApplicationService";
import type { S3Service } from "../../src/services/s3/s3Service";

const mockJobRole: JobRole = {
	id: 1,
	roleName: "Backend Engineer",
	location: "Remote",
	capabilityId: 1,
	capabilityName: "Engineering",
	bandId: 2,
	bandName: "B2",
	closingDate: new Date("2027-01-01"),
	status: "open",
	description: "desc",
	responsibilities: "resp",
};

const mockApplication: JobApplication = {
	id: 10,
	jobRoleId: 1,
	applicantId: "user-abc",
	status: "in_progress",
	cvS3Key: "cvs/1/user-abc/uuid-cv.pdf",
	cvFileName: "cv.pdf",
	cvMimeType: "application/pdf",
	cvSizeBytes: 1024,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const makeUploadParams = () => ({
	jobRoleId: 1,
	applicantId: "user-abc",
	cvBuffer: Buffer.from("pdf"),
	cvFileName: "cv.pdf",
	cvMimeType: "application/pdf",
	cvSizeBytes: 1024,
});

describe("JobApplicationService", () => {
	let service: JobApplicationService;
	let mockJobRoleDao: JobRoleDao;
	let mockJobApplicationDao: JobApplicationDao;
	let mockS3Service: S3Service;

	beforeEach(() => {
		vi.clearAllMocks();

		mockJobRoleDao = {
			getJobRoles: vi.fn(),
			JobRoleDetailedResponse: vi.fn(async () => mockJobRole),
		};

		mockJobApplicationDao = {
			upsert: vi.fn(async () => mockApplication),
			findByJobRoleAndApplicant: vi.fn(async () => null),
		};

		mockS3Service = {
			upload: vi.fn(async () => undefined),
		};

		service = new JobApplicationService(
			mockJobApplicationDao,
			mockJobRoleDao,
			mockS3Service,
		);
	});

	it("creates application and returns response on success", async () => {
		const result = await service.createApplication(makeUploadParams());

		expect(mockJobRoleDao.JobRoleDetailedResponse).toHaveBeenCalledWith(1);
		expect(mockS3Service.upload).toHaveBeenCalledOnce();
		expect(mockJobApplicationDao.upsert).toHaveBeenCalledOnce();
		expect(result).toMatchObject({
			id: 10,
			jobRoleId: 1,
			applicantId: "user-abc",
			status: "in_progress",
			cvFileName: "cv.pdf",
		});
	});

	it("passes correct status to upsert", async () => {
		await service.createApplication(makeUploadParams());

		const upsertCall = vi.mocked(mockJobApplicationDao.upsert).mock.calls[0][0];
		expect(upsertCall.status).toBe("in_progress");
	});

	it("passes correct CV metadata to upsert", async () => {
		await service.createApplication(makeUploadParams());

		const upsertCall = vi.mocked(mockJobApplicationDao.upsert).mock.calls[0][0];
		expect(upsertCall.cvFileName).toBe("cv.pdf");
		expect(upsertCall.cvMimeType).toBe("application/pdf");
		expect(upsertCall.cvSizeBytes).toBe(1024);
	});

	it("passes S3 key to upsert that contains jobRoleId and applicantId", async () => {
		await service.createApplication(makeUploadParams());

		const upsertCall = vi.mocked(mockJobApplicationDao.upsert).mock.calls[0][0];
		expect(upsertCall.cvS3Key).toContain("cvs/1/user-abc/");
		expect(upsertCall.cvS3Key).toContain("cv.pdf");
	});

	it("throws JobNotFoundError when job role does not exist", async () => {
		vi.mocked(mockJobRoleDao.JobRoleDetailedResponse).mockResolvedValue(null);

		await expect(service.createApplication(makeUploadParams())).rejects.toThrow(
			JobNotFoundError,
		);
		expect(mockS3Service.upload).not.toHaveBeenCalled();
		expect(mockJobApplicationDao.upsert).not.toHaveBeenCalled();
	});

	it("throws S3UploadError when S3 upload fails", async () => {
		vi.mocked(mockS3Service.upload).mockRejectedValue(
			new Error("S3 unavailable"),
		);

		await expect(service.createApplication(makeUploadParams())).rejects.toThrow(
			S3UploadError,
		);
		expect(mockJobApplicationDao.upsert).not.toHaveBeenCalled();
	});

	it("rethrows dao errors unchanged", async () => {
		const daoError = new Error("db error");
		vi.mocked(mockJobApplicationDao.upsert).mockRejectedValue(daoError);

		await expect(service.createApplication(makeUploadParams())).rejects.toBe(
			daoError,
		);
	});

	describe("getApplicationForRole", () => {
		it("returns mapped response when application exists", async () => {
			vi.mocked(
				mockJobApplicationDao.findByJobRoleAndApplicant,
			).mockResolvedValue(mockApplication);

			const result = await service.getApplicationForRole(1, "user-abc");

			expect(
				mockJobApplicationDao.findByJobRoleAndApplicant,
			).toHaveBeenCalledWith(1, "user-abc");
			expect(result).toMatchObject({
				id: 10,
				jobRoleId: 1,
				applicantId: "user-abc",
				status: "in_progress",
				cvFileName: "cv.pdf",
			});
		});

		it("returns null when no application exists", async () => {
			vi.mocked(
				mockJobApplicationDao.findByJobRoleAndApplicant,
			).mockResolvedValue(null);

			const result = await service.getApplicationForRole(1, "user-abc");

			expect(result).toBeNull();
		});
	});
});
