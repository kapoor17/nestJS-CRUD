import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signin(dto : AuthDto) {
    //find user in db
    const user = await this.prisma.user.findUnique({
      where:{
        email : dto.email
      }
    })
    //check if exists
    if(!user) throw new ForbiddenException("Invalid Email");
    //match password
    const pwMatch = await argon.verify(user.hash, dto.password)
    //return user
    if(!pwMatch) throw new ForbiddenException("Incorrect Password");

    delete user.hash;
    return user;
  }


  async signup(dto : AuthDto) {
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
      // or `delete user.hash`;
      return user;
    } catch(error) {
      // issue fixed, issue in import 
      if(error instanceof PrismaClientKnownRequestError){
        if(error.code === 'P2002'){
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }
}
