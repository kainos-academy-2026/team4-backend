import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AwsS3Service } from "../../../src/services/s3/awsS3Service";

const sendMock = vi.hoisted(() => vi.fn());
const s3ClientMock = vi.hoisted(() =>
	vi.fn(function S3ClientMock() {
		return {
			send: sendMock,
		};
	}),
);
const putObjectCommandMock = vi.hoisted(() =>
	vi.fn(function PutObjectCommandMock(input) {
		return { input, __type: "PutObjectCommand" };
	}),
);
const getSignedUrlMock = vi.hoisted(() => vi.fn());

vi.mock("@aws-sdk/client-s3", () => ({
	S3Client: s3ClientMock,
	PutObjectCommand: putObjectCommandMock,
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
	getSignedUrl: getSignedUrlMock,
}));

describe("AwsS3Service", () => {
	const originalRegion = process.env.AWS_REGION;
	const originalBucket = process.env.S3_BUCKET_NAME;

	beforeEach(() => {
		sendMock.mockReset();
		s3ClientMock.mockClear();
		putObjectCommandMock.mockClear();
		getSignedUrlMock.mockReset();
		delete process.env.AWS_REGION;
		delete process.env.S3_BUCKET_NAME;
	});

	afterAll(() => {
		if (typeof originalRegion === "undefined") {
			delete process.env.AWS_REGION;
		} else {
			process.env.AWS_REGION = originalRegion;
		}

		if (typeof originalBucket === "undefined") {
			delete process.env.S3_BUCKET_NAME;
		} else {
			process.env.S3_BUCKET_NAME = originalBucket;
		}
	});

	describe("upload", () => {
		it("throws when AWS_REGION is missing", async () => {
			process.env.S3_BUCKET_NAME = "job-apps";
			const service = new AwsS3Service();

			await expect(
				service.upload({
					key: "cvs/1/file.pdf",
					body: Buffer.from("pdf"),
					mimeType: "application/pdf",
				}),
			).rejects.toThrow("AWS_REGION is not set");
			expect(s3ClientMock).not.toHaveBeenCalled();
		});

		it("throws when S3_BUCKET_NAME is missing", async () => {
			process.env.AWS_REGION = "eu-west-1";
			const service = new AwsS3Service();

			await expect(
				service.upload({
					key: "cvs/1/file.pdf",
					body: Buffer.from("pdf"),
					mimeType: "application/pdf",
				}),
			).rejects.toThrow("S3_BUCKET_NAME is not set");
			expect(s3ClientMock).not.toHaveBeenCalled();
		});

		it("creates PutObjectCommand and sends it with configured client", async () => {
			process.env.AWS_REGION = "eu-west-1";
			process.env.S3_BUCKET_NAME = "job-apps";
			sendMock.mockResolvedValue({});

			const service = new AwsS3Service();
			await service.upload({
				key: "cvs/2/user-a/cv.pdf",
				body: Buffer.from("pdf"),
				mimeType: "application/pdf",
			});

			expect(s3ClientMock).toHaveBeenCalledWith({ region: "eu-west-1" });
			expect(putObjectCommandMock).toHaveBeenCalledWith({
				Bucket: "job-apps",
				Key: "cvs/2/user-a/cv.pdf",
				Body: Buffer.from("pdf"),
				ContentType: "application/pdf",
			});
			expect(sendMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("getPresignedPutUrl", () => {
		it("throws when AWS_REGION is missing", async () => {
			process.env.S3_BUCKET_NAME = "job-apps";
			const service = new AwsS3Service();

			await expect(
				service.getPresignedPutUrl({ key: "cvs/1/user/file.pdf" }),
			).rejects.toThrow("AWS_REGION is not set");
		});

		it("throws when S3_BUCKET_NAME is missing", async () => {
			process.env.AWS_REGION = "eu-west-1";
			const service = new AwsS3Service();

			await expect(
				service.getPresignedPutUrl({ key: "cvs/1/user/file.pdf" }),
			).rejects.toThrow("S3_BUCKET_NAME is not set");
		});

		it("calls getSignedUrl with PutObjectCommand and returns the URL", async () => {
			process.env.AWS_REGION = "eu-west-1";
			process.env.S3_BUCKET_NAME = "job-apps";
			getSignedUrlMock.mockResolvedValue("https://s3.example.com/presigned");

			const service = new AwsS3Service();
			const url = await service.getPresignedPutUrl({
				key: "cvs/1/user-a/cv.pdf",
				mimeType: "application/pdf",
			});

			expect(putObjectCommandMock).toHaveBeenCalledWith({
				Bucket: "job-apps",
				Key: "cvs/1/user-a/cv.pdf",
				ContentType: "application/pdf",
			});
			expect(getSignedUrlMock).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				{ expiresIn: 300 },
			);
			expect(url).toBe("https://s3.example.com/presigned");
		});

		it("uses provided expiresIn value", async () => {
			process.env.AWS_REGION = "eu-west-1";
			process.env.S3_BUCKET_NAME = "job-apps";
			getSignedUrlMock.mockResolvedValue("https://s3.example.com/presigned");

			const service = new AwsS3Service();
			await service.getPresignedPutUrl({
				key: "cvs/1/user-a/cv.pdf",
				expiresIn: 600,
			});

			expect(getSignedUrlMock).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				{ expiresIn: 600 },
			);
		});
	});
});
