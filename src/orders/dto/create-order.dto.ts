import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto.js';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Customer ID wajib disertakan' })
  @IsUUID(undefined, { message: 'Format Customer ID harus berupa UUID' })
  readonly customerId: string;

  @IsNotEmpty({ message: 'Address ID wajib disertakan' })
  @IsUUID(undefined, { message: 'Format Address ID harus berupa UUID' })
  readonly addressId: string;

  @IsArray({ message: 'Daftar item harus berupa array' })
  @ArrayMinSize(1, { message: 'Minimal 1 item dalam pesanan' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  readonly items: OrderItemDto[];
}
