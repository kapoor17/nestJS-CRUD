import { Injectable } from "@nestjs/common"

@Injectable({})
export class AuthService {
	signup() {
		return "this is signup"
	}

	signin() {
		return "this is signin"
	}
}
