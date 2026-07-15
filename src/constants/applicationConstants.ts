export const APPLICATION_STATUS = {
	IN_PROGRESS: "in_progress",
	SUBMITTED: "submitted",
	WITHDRAWN: "withdrawn",
} as const;

export type ApplicationStatus =
	(typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export const ALLOWED_CV_MIME_TYPES = [
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ALLOWED_CV_EXTENSIONS = ["pdf", "doc", "docx"] as const;
