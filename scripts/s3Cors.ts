/**
 * Applies a CORS policy to the S3 bucket so browsers can PUT files directly
 * via presigned URLs from the frontend origin.
 *
 * Usage:
 *   npm run s3:set-cors
 *
 * Required env vars (loaded from .env):
 *   AWS_REGION, S3_BUCKET_NAME, FRONTEND_ORIGIN
 */
import "dotenv/config";
import {
	type CORSRule,
	PutBucketCorsCommand,
	S3Client,
} from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;
const frontendOrigin = process.env.FRONTEND_ORIGIN;

if (!region) throw new Error("AWS_REGION is not set");
if (!bucketName) throw new Error("S3_BUCKET_NAME is not set");
if (!frontendOrigin) throw new Error("FRONTEND_ORIGIN is not set");

const client = new S3Client({ region });

const corsRules: CORSRule[] = [
	{
		AllowedOrigins: [frontendOrigin],
		AllowedMethods: ["PUT"],
		AllowedHeaders: ["Content-Type", "Content-Length"],
		ExposeHeaders: ["ETag"],
		MaxAgeSeconds: 3000,
	},
];

const command = new PutBucketCorsCommand({
	Bucket: bucketName,
	CORSConfiguration: { CORSRules: corsRules },
});

client
	.send(command)
	.then(() => {
		console.log(
			`CORS rule applied to bucket "${bucketName}" for origin "${frontendOrigin}"`,
		);
	})
	.catch((error: unknown) => {
		console.error("Failed to apply CORS rule:", error);
		process.exit(1);
	});
