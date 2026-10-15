import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Title harus diisi' })
  @IsString()
  readonly title: string;

  @IsNotEmpty({ message: 'Author harus diisi' })
  @IsString()
  readonly author: string;

  @IsNotEmpty({ message: 'ISBN harus diisi' })
  @IsString()
  readonly isbn: string;

  @IsNotEmpty({ message: 'Published Year harus diisi' })
  @IsInt({ message: 'Published Year harus berupa angka' })
  readonly publishedYear: number;
}