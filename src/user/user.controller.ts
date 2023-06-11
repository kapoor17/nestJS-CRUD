import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    @Get('/me')
    getMe(@GetUser() user : User, @GetUser('email') email : string){
        console.log({
            email
        })
        return user;
    }
}
