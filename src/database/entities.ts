import { Book } from '../books/entities/book-entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { Publisher } from '../publishers/entities/publisher.entity.js';
import { Author } from '../authors/entities/author.entity.js';
import { Customer } from '../customers/entities/customer.entity.js';
import { CustomerAddress } from '../customers/entities/customer-address.entity.js';
import { Order } from '../orders/entities/order.entity.js';
import { OrderItem } from '../orders/entities/order-item.entity.js';
import { Payment } from '../payments/entities/payment.entity.js';
import { Shipment } from '../shipments/entities/shipment.entity.js';

// Daftar SEMUA entity (dipakai oleh aplikasi dan oleh TypeORM CLI untuk migrasi)
export const entities = [
  Book,
  Category,
  Publisher,
  Author,
  Customer,
  CustomerAddress,
  Order,
  OrderItem,
  Payment,
  Shipment,
];
