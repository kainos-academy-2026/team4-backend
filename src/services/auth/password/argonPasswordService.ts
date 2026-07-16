// Compares plaintext password with hashed password stored in Database
import argon2 from "argon2";
import type PasswordService from "./passwordService";

// Fixed dummy hash used when no user hash is available to reduce timing variance.
const DUMMY_PASSWORD_HASH =
	"$argon2id$v=19$m=65536,t=3,p=4$dHVtbXlfc2FsdF92YWx1ZQ$2aQ6eNv2YJEO2ubVhtSGcjyxjB1j1l3fMijLhSLiOB0";

export default class ArgonPasswordService implements PasswordService {
	async hash(password: string): Promise<string> {
		return await argon2.hash(password);
	}

	async verify(password: string, hash?: string): Promise<boolean> {
		const hashToVerify = hash ?? DUMMY_PASSWORD_HASH;

		try {
			return await argon2.verify(hashToVerify, password);
		} catch (error) {
			console.error("Error verifying password:", error);
			return false;
		}
	}
}
