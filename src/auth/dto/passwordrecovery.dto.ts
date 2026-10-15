import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PasswordRecoveryDto {
  @IsNotEmpty({ message: 'Username harus diisi' })
  @IsString({ message: 'Username harus berupa teks' })
  @MaxLength(30, { message: 'Username maksimal 30 karakter' })
  readonly username: string;

  @IsNotEmpty({ message: 'Email harus diisi' })
  @Matches(/^[^\s@]+@gmail\.com$/, {
    message: 'Format email tidak valid, harus menggunakan @gmail.com',
  })
  readonly email: string;

  @IsNotEmpty({ message: 'Password baru harus diisi' })
  @IsString({ message: 'Password baru harus berupa teks' })
  @MinLength(3, { message: 'Password minimal 3 karakter' })
  @MaxLength(16, { message: 'Password maksimal 16 karakter' })
  readonly password: string;

  @IsNotEmpty({ message: 'Konfirmasi password harus diisi' })
  @IsString({ message: 'Konfirmasi password harus berupa teks' })
  @MinLength(3, { message: 'Konfirmasi password minimal 3 karakter' })
  @MaxLength(16, { message: 'Konfirmasi password maksimal 16 karakter' })
  readonly confirmPassword: string;
}