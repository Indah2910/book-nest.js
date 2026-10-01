import { Injectable } from '@nestjs/common';
import { RegisterOptions } from 'module';
import { RegisterDto } from './dto/register.dto.js';
import { User } from './entities/users-entity.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgetPasswordDto } from './dto/forgetpassword.dto.js';
import { PasswordRecoveryDto } from './dto/passwordrecovery.dto.js';

@Injectable()
export class AuthService {
    //regiater
    register(registerDto: RegisterDto): User{
        const newUser: User = {
            id: 1, 
            username:registerDto.username,
            email: registerDto.email,
            password: registerDto.password,
        };

        return newUser;

    }

    //login
    login(loginDto: LoginDto): User{
        const logUser: User ={
            id: 1, 
            username:loginDto.username,
            email: loginDto.email,
            password: loginDto.password,
        };

        return logUser;

    }

    //forget password 
    forgetPassword(forgetPasswordDto: ForgetPasswordDto): User{
        const forgetUser: User = {
            id: 1,
            username: forgetPasswordDto.username,
            email: forgetPasswordDto.email,
            password: forgetPasswordDto.password,
        };

        return forgetUser;

    }

    //password recovery
    passwordRecovery(passwordRecoveryDto: PasswordRecoveryDto): User{
        const passUser: User = {
            id: 1,
            username:passwordRecoveryDto.username,
            email: passwordRecoveryDto.email,
            password: passwordRecoveryDto.password,
        };

        return passUser;

    }

}
