import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup() {
    return { msg: "this is signup" };
  }

  async signin(dto : AuthDto) {
    try{
      // generate the password
      const hash = await argon.hash(dto.password);
      // save the user
      const user = await this.prisma.user.create({
        data:{
          email : dto.email,
          hash
        },
        select:{
          email:true,
          firstName:true,
          createdAt:true,
        }
      })
      // or delete user.hash;

      return user;
    } catch(error) {
      if(error instanceof PrismaClientKnownRequestError){
        console.log("herhehrhe2")
        if(error.code === 'P2002'){
          throw new ForbiddenException('Credentials Taken');
        }
      }else{
        console.log("herhehrhe")
        throw error
      }
    }
  }
}
