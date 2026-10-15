import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username harus diisi' })
  @IsString({ message: 'Username harus berupa teks' })
  @MaxLength(30, { message: 'Username maksimal 30 karakter' })
  readonly username: string;

  @IsNotEmpty({ message: 'Password harus diisi' })
  @IsString({ message: 'Password harus berupa teks' })
  @MinLength(3, { message: 'Password minimal 3 karakter' })
  @MaxLength(16, { message: 'Password maksimal 16 karakter' })
  readonly password: string;
}