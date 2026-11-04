import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString({ message: 'Title harus berupa teks' })
  @MaxLength(150)
  readonly title?: string;

  @IsOptional()
  @IsString({ message: 'ISBN harus berupa teks' })
  @MaxLength(45)
  readonly isbn?: string;

  @IsOptional()
  @IsInt({ message: 'Published Year harus berupa angka' })
  readonly publishedYear?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Price harus berupa angka' })
  @Min(0)
  readonly price?: number;

  @IsOptional()
  @IsInt({ message: 'Stock harus berupa bilangan bulat' })
  @Min(0)
  readonly stock?: number;

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
