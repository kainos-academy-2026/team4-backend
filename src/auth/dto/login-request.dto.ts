export type LoginRequestDto = {
	email: string;
	password: string;
};

export type LoginResponseDto = {
	accessToken: string;
	tokenType: "Bearer";
	expiresIn: string;
	user: {
		id: string;
		email: string;
	};
};
