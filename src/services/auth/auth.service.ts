import type { LoginRequestDto } from "../../dto/loginRequest.dto";
import type { LoginResponseDto } from "../../dto/loginResponse.dto";

export default interface AuthService {
	login(request: LoginRequestDto): Promise<LoginResponseDto>;
}
