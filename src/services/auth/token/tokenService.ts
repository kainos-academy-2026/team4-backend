import type User from "../../../models/userModel";

export default interface TokenService {
	create(user: User): Promise<string>;
}
