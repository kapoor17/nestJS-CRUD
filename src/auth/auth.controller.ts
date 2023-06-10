import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "src/dto";

@Controller("auth")
export class AuthController {
  constructor(private authSerive: AuthService) {}

  @Post("signup")
  signup() {
    return this.authSerive.signup();
  }

  @Post("signin")
  signin(@Body() dto : AuthDto) {
    console.log({
      dto
    })
    return this.authSerive.signin();
  }
}
