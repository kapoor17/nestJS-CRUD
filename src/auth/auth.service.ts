import { Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup() {
    return { msg: "this is signup" };
  }

  async signin(dto : AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);
    // save the user
    const user = await this.prisma.user.create({
      data:{
        email : dto.email,
        hash
      }
    })
    return user;
  }
}
