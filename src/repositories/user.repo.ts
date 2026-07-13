import type User from "../Models/user.model";

export default interface UserRepository {
	findByEmail(email: string): Promise<User | null>;
}
