import { Body, Controller, Get, Post, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from "../../bl";
import { ILoginRequest, ISignUpRequest } from "../../models";
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post('login')
    async login(@Body() loginRequest: ILoginRequest) {
        return await this.userService.login(loginRequest);
    }

    @Post('signup')
    async signUp(@Body() signUpRequest: ISignUpRequest) {
        return await this.userService.signUp(signUpRequest);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getCurrentProfile(@CurrentUser() user) {
        if (user) {
            return await this.userService.getById(user.id, user);
        } else {
            throw new NotFoundException('User Not found');
        }
    }
}