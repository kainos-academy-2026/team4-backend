export interface S3UploadParams {
	key: string;
	body: Buffer;
	mimeType: string;
}

export interface S3PresignedPutParams {
	key: string;
	mimeType?: string;
	expiresIn?: number;
}

export interface S3Service {
	upload(params: S3UploadParams): Promise<void>;
	getPresignedPutUrl(params: S3PresignedPutParams): Promise<string>;
}
