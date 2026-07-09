// Compares plaintext password with hashed password stored in Database
import argon2 from "argon2";
import type PasswordService from "./password.service.ts";

export default class ArgonPasswordService implements PasswordService {
	async verify(password: string, hash: string): Promise<boolean> {
		try {
			return await argon2.verify(hash, password);
		} catch (error) {
			console.error("Error verifying password:", error);
			return false;
		}
	}
}
