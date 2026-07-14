export default interface PasswordService {
	verify(password: string, hash?: string): Promise<boolean>;
}
