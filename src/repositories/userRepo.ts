import type User from "../models/userModel";

export default interface UserRepository {
	findByEmail(email: string): Promise<User | null>;
}
