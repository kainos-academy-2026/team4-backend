import type { LoginRequestDto } from "../../dto/loginRequestDto";
import type { LoginResponseDto } from "../../dto/loginResponseDto";

export default interface AuthService {
	login(request: LoginRequestDto): Promise<LoginResponseDto>;
}
