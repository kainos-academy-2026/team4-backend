import { describe, expect, it } from "vitest";
import { JobApplicationRequestMapper } from "../../src/mappers/jobApplicationRequestMapper";
import { InvalidApplicationPayloadError } from "../../src/services/errors/invalidApplicationPayloadError";

describe("JobApplicationRequestMapper", () => {
	const mapper = new JobApplicationRequestMapper();

	describe("toGenerateUploadUrlParams", () => {
		it("maps valid input and coerces jobRoleId", () => {
			const result = mapper.toGenerateUploadUrlParams({
				jobRoleIdParam: "1",
				applicantId: "user-abc",
				mimeType: "application/pdf",
				fileName: "cv.pdf",
			});

			expect(result).toEqual({
				jobRoleId: 1,
				applicantId: "user-abc",
				mimeType: "application/pdf",
				fileName: "cv.pdf",
			});
		});

		it("throws InvalidApplicationPayloadError when mimeType is missing", () => {
			expect(() =>
				mapper.toGenerateUploadUrlParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					mimeType: undefined,
					fileName: "cv.pdf",
				}),
			).toThrowError(
				new InvalidApplicationPayloadError("mimeType is required"),
			);
		});

		it("throws InvalidApplicationPayloadError when mimeType is invalid", () => {
			expect(() =>
				mapper.toGenerateUploadUrlParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					mimeType: "image/png",
					fileName: "cv.pdf",
				}),
			).toThrowError(
				new InvalidApplicationPayloadError(
					"Invalid file type. Allowed types: pdf, doc, docx",
				),
			);
		});
	});

	describe("toCreateApplicationParams", () => {
		it("maps valid input and coerces numeric fields", () => {
			const result = mapper.toCreateApplicationParams({
				jobRoleIdParam: "1",
				applicantId: "user-abc",
				s3Key: "cvs/1/user-abc/uuid-cv.pdf",
				cvFileName: "cv.pdf",
				cvMimeType: "application/pdf",
				cvSizeBytes: "1024",
			});

			expect(result).toEqual({
				jobRoleId: 1,
				applicantId: "user-abc",
				s3Key: "cvs/1/user-abc/uuid-cv.pdf",
				cvFileName: "cv.pdf",
				cvMimeType: "application/pdf",
				cvSizeBytes: 1024,
			});
		});

		it("throws InvalidApplicationPayloadError when required body fields are missing", () => {
			expect(() =>
				mapper.toCreateApplicationParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					s3Key: undefined,
					cvFileName: undefined,
					cvMimeType: undefined,
					cvSizeBytes: undefined,
				}),
			).toThrowError(
				new InvalidApplicationPayloadError(
					"s3Key, cvFileName, cvMimeType and cvSizeBytes are required",
				),
			);
		});

		it("throws InvalidApplicationPayloadError when s3Key is outside scoped prefix", () => {
			expect(() =>
				mapper.toCreateApplicationParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					s3Key: "cvs/1/another-user/uuid-cv.pdf",
					cvFileName: "cv.pdf",
					cvMimeType: "application/pdf",
					cvSizeBytes: 1024,
				}),
			).toThrowError(
				new InvalidApplicationPayloadError(
					"s3Key must be scoped to the authenticated applicant and job role",
				),
			);
		});
	});
});
