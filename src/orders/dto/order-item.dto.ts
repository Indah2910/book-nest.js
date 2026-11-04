import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty({ message: 'Book ID wajib disertakan' })
  @IsUUID(undefined, { message: 'Format Book ID harus berupa UUID' })
  readonly bookId: string;

  @IsInt({ message: 'Kuantitas harus bilangan bulat' })
  @Min(1, { message: 'Kuantitas minimal 1' })
  readonly quantity: number;
}
