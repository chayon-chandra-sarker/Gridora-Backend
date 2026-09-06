import dotenv from "dotenv";
import path from "node:path";
import type { SignOptions } from "jsonwebtoken";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	port: process.env.PORT,
	database_url: process.env.DATABASE_URL,
	app_url: process.env.APP_URL,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

	jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,

	google_client_id: process.env.GOOGLE_CLIENT_ID!,
	google_client_secret: process.env.GOOGLE_CLIENT_SECRET!,
	email_user: process.env.EMAIL_USER!,
	email_pass: process.env.EMAIL_PASS!,
	bkash_base_url: process.env.BKASH_BASE_URL!,
	bkash_app_key: process.env.BKASH_APP_KEY!,
	bkash_app_secret: process.env.BKASH_APP_SECRET!,
	bkash_user_name: process.env.BKASH_USER_NAME!,
	bkash_password: process.env.BKASH_PASSWORD!,
	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
	redis_url: process.env.REDIS_URL!,

	jwt_access_expires_in: (process.env.JWT_ACCESS_EXPIRES_IN ||
		"1d") as NonNullable<SignOptions["expiresIn"]>,

	jwt_refresh_expires_in: (process.env.JWT_REFRESH_EXPIRES_IN ||
		"7d") as NonNullable<SignOptions["expiresIn"]>,
};
