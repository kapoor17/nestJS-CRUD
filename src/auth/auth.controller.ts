import { Body, Controller, ParseIntPipe, Post } from "@nestjs/common";
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
  signin(@Body('email') email : string, @Body('password', ParseIntPipe) password : string) {
    console.log({
      email,
      typeOfEmail: typeof email,
      password,
      typeOfPassword: typeof password,
    })
    return this.authSerive.signin();
  }
}
