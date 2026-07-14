import type User from "../models/user.model";

export default interface UserRepository {
	findByEmail(email: string): Promise<User | null>;
}
