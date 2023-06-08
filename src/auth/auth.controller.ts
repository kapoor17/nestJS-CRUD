import { Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
	constructor(private authSerive: AuthService) {}

	@Post("signup")
	signup() {
		return this.authSerive.signup()
	}

	@Post("signin")
	signin() {
		return this.authSerive.signin()
	}
}
