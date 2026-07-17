import { describe, expect, it, vi } from "vitest";
import {
	CreateApplicationInputSchema,
	GenerateUploadUrlInputSchema,
	GetApplicationForRoleInputSchema,
} from "../../src/dto/jobApplicationDto";
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

		it("uses default message when schema returns failure without issues", () => {
			const safeParseSpy = vi
				.spyOn(GenerateUploadUrlInputSchema, "safeParse")
				.mockReturnValue({
					success: false,
					error: { issues: [] },
				} as never);

			expect(() =>
				mapper.toGenerateUploadUrlParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					mimeType: "application/pdf",
					fileName: "cv.pdf",
				}),
			).toThrowError(
				new InvalidApplicationPayloadError("Invalid application payload"),
			);

			safeParseSpy.mockRestore();
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

		it("throws missing-required-fields error when cvFileName is missing", () => {
			expect(() =>
				mapper.toCreateApplicationParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					s3Key: "cvs/1/user-abc/uuid-cv.pdf",
					cvFileName: undefined,
					cvMimeType: "application/pdf",
					cvSizeBytes: 1024,
				}),
			).toThrowError(
				new InvalidApplicationPayloadError(
					"s3Key, cvFileName, cvMimeType and cvSizeBytes are required",
				),
			);
		});

		it("throws missing-required-fields error when cvMimeType is missing", () => {
			const safeParseSpy = vi
				.spyOn(CreateApplicationInputSchema, "safeParse")
				.mockReturnValue({
					success: false,
					error: {
						issues: [
							{
								code: "invalid_type",
								path: ["cvMimeType"],
								message: "cvMimeType is required",
							},
						],
					},
				} as never);

			expect(() =>
				mapper.toCreateApplicationParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					s3Key: "cvs/1/user-abc/uuid-cv.pdf",
					cvFileName: "cv.pdf",
					cvMimeType: undefined,
					cvSizeBytes: 1024,
				}),
			).toThrowError(
				new InvalidApplicationPayloadError(
					"s3Key, cvFileName, cvMimeType and cvSizeBytes are required",
				),
			);

			safeParseSpy.mockRestore();
		});

		it("throws missing-required-fields error when cvSizeBytes is missing", () => {
			expect(() =>
				mapper.toCreateApplicationParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					s3Key: "cvs/1/user-abc/uuid-cv.pdf",
					cvFileName: "cv.pdf",
					cvMimeType: "application/pdf",
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

		it("throws InvalidApplicationPayloadError when s3Key has no file name", () => {
			expect(() =>
				mapper.toCreateApplicationParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					s3Key: "cvs/1/user-abc/",
					cvFileName: "cv.pdf",
					cvMimeType: "application/pdf",
					cvSizeBytes: 1024,
				}),
			).toThrowError(
				new InvalidApplicationPayloadError("s3Key must include a file name"),
			);
		});

		it("uses default message when schema returns failure without issues", () => {
			const safeParseSpy = vi
				.spyOn(CreateApplicationInputSchema, "safeParse")
				.mockReturnValue({
					success: false,
					error: { issues: [] },
				} as never);

			expect(() =>
				mapper.toCreateApplicationParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
					s3Key: "cvs/1/user-abc/uuid-cv.pdf",
					cvFileName: "cv.pdf",
					cvMimeType: "application/pdf",
					cvSizeBytes: 1024,
				}),
			).toThrowError(
				new InvalidApplicationPayloadError("Invalid application payload"),
			);

			safeParseSpy.mockRestore();
		});
	});

	describe("toGetApplicationForRoleParams", () => {
		it("maps valid input and coerces jobRoleId", () => {
			const result = mapper.toGetApplicationForRoleParams({
				jobRoleIdParam: "7",
				applicantId: "user-abc",
			});

			expect(result).toEqual({
				jobRoleId: 7,
				applicantId: "user-abc",
			});
		});

		it("throws InvalidApplicationPayloadError when jobRoleId is invalid", () => {
			expect(() =>
				mapper.toGetApplicationForRoleParams({
					jobRoleIdParam: "abc",
					applicantId: "user-abc",
				}),
			).toThrowError(
				new InvalidApplicationPayloadError(
					"Invalid input: expected number, received NaN",
				),
			);
		});

		it("uses default message when schema returns failure without issues", () => {
			const safeParseSpy = vi
				.spyOn(GetApplicationForRoleInputSchema, "safeParse")
				.mockReturnValue({
					success: false,
					error: { issues: [] },
				} as never);

			expect(() =>
				mapper.toGetApplicationForRoleParams({
					jobRoleIdParam: "1",
					applicantId: "user-abc",
				}),
			).toThrowError(
				new InvalidApplicationPayloadError("Invalid application payload"),
			);

			safeParseSpy.mockRestore();
		});
	});
});
