import type User from "../../../Models/user.model";

export default interface TokenService {
	create(user: User): Promise<string>;
}
