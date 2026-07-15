export interface S3UploadParams {
	key: string;
	body: Buffer;
	mimeType: string;
}

export interface S3Service {
	upload(params: S3UploadParams): Promise<void>;
}
