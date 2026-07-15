import { signAuthToken } from "../Auth/authToken";
import type { Role } from "../Auth/role";
import type { UserDao } from "../Dao/userDao";
import { PrismaUserDao } from "../Dao/userDao";

export class UserAlreadyExistsError extends Error {
	public constructor() {
		super("User already exists");
	}
}

export class InvalidCredentialsError extends Error {
	public constructor() {
		super("Invalid credentials");
	}
}

export class AuthService {
	public constructor(private readonly userDao: UserDao = new PrismaUserDao()) {}

	public async register(input: {
		email: string;
		password: string;
		role: Role;
	}): Promise<{ token: string }> {
		const existingUser = await this.userDao.findByEmail(input.email);
		if (existingUser) {
			throw new UserAlreadyExistsError();
		}

		const user = await this.userDao.createUser(input);
		const token = await signAuthToken({
			userId: user.id,
			email: user.email,
			role: user.role,
		});

		return { token };
	}

	public async login(input: {
		email: string;
		password: string;
	}): Promise<{ token: string }> {
		const user = await this.userDao.findByEmail(input.email);
		if (!user || user.password !== input.password) {
			throw new InvalidCredentialsError();
		}

		const token = await signAuthToken({
			userId: user.id,
			email: user.email,
			role: user.role,
		});

		return { token };
	}
}
