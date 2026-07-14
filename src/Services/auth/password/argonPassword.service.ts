// Compares plaintext password with hashed password stored in Database
import argon2 from "argon2";
import type PasswordService from "./password.service";

// Fixed dummy hash used when no user hash is available to reduce timing variance.
const DUMMY_PASSWORD_HASH =
	"$argon2id$v=19$m=65536,t=3,p=4$dHVtbXlfc2FsdF92YWx1ZQ$2aQ6eNv2YJEO2ubVhtSGcjyxjB1j1l3fMijLhSLiOB0";

export default class ArgonPasswordService implements PasswordService {
	async verify(password: string, hash?: string): Promise<boolean> {
		const hashToVerify = hash ?? DUMMY_PASSWORD_HASH;
		return await argon2.verify(hashToVerify, password);
	}
}
