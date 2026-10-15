import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { User } from './entities/users-entity.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgetPasswordDto } from './dto/forgetpassword.dto.js';
import { PasswordRecoveryDto } from './dto/passwordrecovery.dto.js';

@Injectable()
export class AuthService {
  // register
  register(registerDto: RegisterDto): User {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException(
        'Konfirmasi password tidak sama dengan password',
      );
    }

    const newUser: User = {
      id: 1,
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
    };

    return newUser;
  }

  // login (LoginDto tidak punya email)
  login(loginDto: LoginDto): Omit<User, 'email'> {
    const logUser: Omit<User, 'email'> = {
      id: 1,
      username: loginDto.username,
      password: loginDto.password,
    };

    return logUser;
  }

  // forget password
  forgetPassword(forgetPasswordDto: ForgetPasswordDto): User {
    const forgetUser: User = {
      id: 1,
      username: forgetPasswordDto.username,
      email: forgetPasswordDto.email,
      password: forgetPasswordDto.password,
    };

    return forgetUser;
  }

  // password recovery
  passwordRecovery(passwordRecoveryDto: PasswordRecoveryDto): User {
    if (passwordRecoveryDto.password !== passwordRecoveryDto.confirmPassword) {
      throw new BadRequestException(
        'Konfirmasi password tidak sama dengan password',
      );
    }

    const passUser: User = {
      id: 1,
      username: passwordRecoveryDto.username,
      email: passwordRecoveryDto.email,
      password: passwordRecoveryDto.password,
    };

    return passUser;
  }
}