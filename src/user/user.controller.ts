import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {

    @UseGuards(JwtGuard)
    @Get('/me')
    getMe(@Req() req : Request){
        console.log({
            user : req.user
        })
        return 'user info';
    }
}
