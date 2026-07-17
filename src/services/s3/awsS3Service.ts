import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
	S3PresignedPutParams,
	S3Service,
	S3UploadParams,
} from "./s3Service";

export class AwsS3Service implements S3Service {
	private clientConfig?: { client: S3Client; bucketName: string };

	private getClient(): { client: S3Client; bucketName: string } {
		if (this.clientConfig) {
			return this.clientConfig;
		}

		const region = process.env.AWS_REGION;
		const bucketName = process.env.S3_BUCKET_NAME;

		if (!region) throw new Error("AWS_REGION is not set");
		if (!bucketName) throw new Error("S3_BUCKET_NAME is not set");

		this.clientConfig = { client: new S3Client({ region }), bucketName };
		return this.clientConfig;
	}

	async upload(params: S3UploadParams): Promise<void> {
		const { client, bucketName } = this.getClient();

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: params.key,
			Body: params.body,
			ContentType: params.mimeType,
		});

		await client.send(command);
	}

	async getPresignedPutUrl(params: S3PresignedPutParams): Promise<string> {
		const { client, bucketName } = this.getClient();

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: params.key,
			ContentType: params.mimeType,
		});

		return getSignedUrl(client, command, {
			expiresIn: params.expiresIn ?? 300,
		});
	}
}
