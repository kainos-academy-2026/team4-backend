import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ALLOWED_CV_MIME_TYPES } from "../constants/applicationConstants";

const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: (_request, file, callback) => {
		const allowed: readonly string[] = ALLOWED_CV_MIME_TYPES;
		if (allowed.includes(file.mimetype)) {
			callback(null, true);
		} else {
			callback(new Error("Invalid file type. Allowed types: pdf, doc, docx"));
		}
	},
});

export const cvUpload = upload.single("cvFile");

export const handleCvUploadErrors = (
	error: unknown,
	_request: Request,
	response: Response,
	next: NextFunction,
): void => {
	if (error instanceof multer.MulterError || error instanceof Error) {
		response.status(400).json({ message: error.message });
		return;
	}
	next(error);
};
