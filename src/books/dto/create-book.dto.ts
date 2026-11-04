import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Title harus diisi' })
  @IsString()
  @MaxLength(150, { message: 'Title maksimal 150 karakter' })
  readonly title: string;

  @IsNotEmpty({ message: 'ISBN harus diisi' })
  @IsString()
  @MaxLength(45, { message: 'ISBN maksimal 45 karakter' })
  readonly isbn: string;

  @IsNotEmpty({ message: 'Published Year harus diisi' })
  @IsInt({ message: 'Published Year harus berupa angka' })
  readonly publishedYear: number;

  @IsNumber({}, { message: 'Price harus berupa angka' })
  @Min(0, { message: 'Price tidak boleh negatif' })
  readonly price: number;

  @IsInt({ message: 'Stock harus berupa bilangan bulat' })
  @Min(0, { message: 'Stock tidak boleh negatif' })
  readonly stock: number;

  @IsOptional()
  @IsUUID(undefined, { message: 'categoryId harus berupa UUID' })
  readonly categoryId?: string;

  @IsOptional()
  @IsUUID(undefined, { message: 'publisherId harus berupa UUID' })
  readonly publisherId?: string;

  @IsOptional()
  @IsArray({ message: 'authorIds harus berupa array' })
  @ArrayUnique({ message: 'authorIds tidak boleh duplikat' })
  @IsUUID(undefined, { each: true, message: 'Setiap authorId harus berupa UUID' })
  readonly authorIds?: string[];
}
