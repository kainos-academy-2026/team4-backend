import type User from "../../../models/user.model";

export default interface TokenService {
	create(user: User): Promise<string>;
}
