import type { LoginRequestDto } from "../../dto/loginRequestDto";
import type { LoginResponseDto } from "../../dto/loginResponseDto";
import type { RegisterRequestDto } from "../../dto/registerRequest.dto";
import type { RegisterResponseDto } from "../../dto/registerResponse.dto";

export default interface AuthService {
	login(request: LoginRequestDto): Promise<LoginResponseDto>;
	register(request: RegisterRequestDto): Promise<RegisterResponseDto>;
	logout(): Promise<void>;
}
