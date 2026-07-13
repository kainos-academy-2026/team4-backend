// Compares plaintext password with hashed password stored in Database
import argon2 from "argon2";
import type PasswordService from "./passwordService";

export default class ArgonPasswordService implements PasswordService {
	async verify(password: string, hash?: string): Promise<boolean> {
		if (!hash) {
			return false;
		}

		return await argon2.verify(hash, password);
	}
}
