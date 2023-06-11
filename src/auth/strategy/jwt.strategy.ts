import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy, 'jwt'){
    constructor(configService: ConfigService, private prismaSerive : PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload : any){
        const user = await this.prismaSerive.user.findUnique({
            where:{
                email : payload.email
            }
        })

        delete user.hash
        return user;
    }
}