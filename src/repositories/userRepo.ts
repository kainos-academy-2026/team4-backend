import type User from "../models/userModel";

export default interface UserRepository {
	create(email: string, passwordHash: string): Promise<User>;
	findByEmail(email: string): Promise<User | null>;
}
