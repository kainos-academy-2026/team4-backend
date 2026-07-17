import { z } from "zod";
import { ALLOWED_CV_MIME_TYPES } from "../constants/applicationConstants";

const allowedMimeTypes: readonly string[] = ALLOWED_CV_MIME_TYPES;

const cvMimeTypeSchema = z.enum(ALLOWED_CV_MIME_TYPES, {
	message: "Invalid file type. Allowed types: pdf, doc, docx",
});

const generateMimeTypeSchema = z.preprocess(
	(value) => value ?? "",
	z
		.string()
		.min(1, "mimeType is required")
		.refine(
			(value) => allowedMimeTypes.includes(value),
			"Invalid file type. Allowed types: pdf, doc, docx",
		),
);

export const GenerateUploadUrlInputSchema = z.object({
	jobRoleId: z.coerce.number().int().positive("Invalid job role id"),
	applicantId: z.string().min(1, "Unauthorised"),
	mimeType: generateMimeTypeSchema,
	fileName: z.string().trim().min(1).optional(),
});

export const CreateApplicationInputSchema = z
	.object({
		jobRoleId: z.coerce.number().int().positive("Invalid job role id"),
		applicantId: z.string().min(1, "Unauthorised"),
		s3Key: z.string().min(1),
		cvFileName: z.string().min(1),
		cvMimeType: cvMimeTypeSchema,
		cvSizeBytes: z.coerce.number().int().nonnegative(),
	})
	.superRefine((value, context) => {
		const prefix = `cvs/${value.jobRoleId}/${value.applicantId}/`;
		if (!value.s3Key.startsWith(prefix)) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["s3Key"],
				message:
					"s3Key must be scoped to the authenticated applicant and job role",
			});
			return;
		}

		if (!value.s3Key.slice(prefix.length)) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["s3Key"],
				message: "s3Key must include a file name",
			});
		}
	});

export const GetApplicationForRoleInputSchema = z.object({
	jobRoleId: z.coerce.number().int().positive("Invalid job role id"),
	applicantId: z.string().min(1, "Unauthorised"),
});

export type GenerateUploadUrlInputDto = z.infer<
	typeof GenerateUploadUrlInputSchema
>;
export type CreateApplicationInputDto = z.infer<
	typeof CreateApplicationInputSchema
>;
export type GetApplicationForRoleInputDto = z.infer<
	typeof GetApplicationForRoleInputSchema
>;
