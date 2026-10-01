import { Body, Controller, Post } from '@nestjs/common';
import { register } from 'module';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgetPasswordDto } from './dto/forgetpassword.dto.js';
import { PasswordRecoveryDto } from './dto/passwordrecovery.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }

    @Post('forgot-password')
    forgotPassword(@Body() forgetPasswordDto: ForgetPasswordDto){
        return this.authService.forgetPassword(forgetPasswordDto);
    } 

    @Post('password-recovery')
    passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto){
        return this.authService.passwordRecovery(passwordRecoveryDto);
    }

}
