export default interface User {
	id: string;
	email: string;
	role: string;
	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
}
