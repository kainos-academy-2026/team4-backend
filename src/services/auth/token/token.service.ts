import type User from "../../../model/user.model";

export default interface TokenService {
	create(user: User): Promise<string>;
}
