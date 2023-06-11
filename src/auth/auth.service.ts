import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

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

    delete user.hash

    return this.signinToken(user.id, user.email)
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

  async signinToken(userId, email) : Promise<{access_token : string}>{
    const payload = {
      sub : userId,
      email
    }

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn : "15m",
      secret: this.configService.get("JWT_SECRET")
    })

    return {
      access_token 
    }
  }

}
