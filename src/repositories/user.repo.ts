import type User from "../model/user.model";

export default interface UserRepository {
	findByEmail(email: string): Promise<User | null>;
}
