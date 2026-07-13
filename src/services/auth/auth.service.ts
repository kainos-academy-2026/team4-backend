import type { LoginRequestDto } from "../../Dto/loginRequest.dto";
import type { LoginResponseDto } from "../../Dto/loginResponse.dto";

export default interface AuthService {
	login(request: LoginRequestDto): Promise<LoginResponseDto>;
}
