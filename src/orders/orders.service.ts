import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { Book } from '../books/entities/book-entity.js';
import { Customer } from '../customers/entities/customer.entity.js';
import { CustomerAddress } from '../customers/entities/customer-address.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

const ORDER_RELATIONS: FindOptionsRelations<Order> = {
  customer: true,
  items: { book: true },
  payment: true,
  shipment: true,
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // Semua relasi diambil dalam SATU query JOIN (bukan N+1)
  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ORDER_RELATIONS,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ORDER_RELATIONS,
    });
    if (!order) {
      throw new NotFoundException(`Pesanan ${id} tidak ditemukan`);
    }
    return order;
  }

  async checkout(dto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validasi pelanggan dan alamat (alamat harus milik pelanggan ini)
      const customer = await queryRunner.manager.findOne(Customer, {
        where: { id: dto.customerId },
      });
      if (!customer) {
        throw new NotFoundException('Pelanggan tidak ditemukan');
      }

      const address = await queryRunner.manager.findOne(CustomerAddress, {
        where: { id: dto.addressId, customer: { id: dto.customerId } },
      });
      if (!address) {
        throw new NotFoundException(
          'Alamat tidak ditemukan untuk pelanggan ini',
        );
      }

      // 2. Proses setiap item: kunci stok, kurangi, hitung subtotal
      let grandTotal = 0;
      const items: OrderItem[] = [];

      for (const itemDto of dto.items) {
        const book = await queryRunner.manager.findOne(Book, {
          where: { id: itemDto.bookId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!book) {
          throw new NotFoundException(`Buku ${itemDto.bookId} tidak ditemukan`);
        }
        if (book.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Stok buku "${book.title}" tidak cukup (tersisa ${book.stock}, diminta ${itemDto.quantity})`,
          );
        }

        // Wajib lewat queryRunner.manager, BUKAN repository biasa
        book.stock -= itemDto.quantity;
        await queryRunner.manager.save(book);

        const price = Number(book.price); // snapshot harga saat transaksi
        const subtotal = price * itemDto.quantity;
        grandTotal += subtotal;

        items.push(
          queryRunner.manager.create(OrderItem, {
            book,
            quantity: itemDto.quantity,
            price,
            subtotal,
          }),
        );
      }

      // 3. Simpan pesanan + snapshot alamat + semua item (cascade)
      const order = queryRunner.manager.create(Order, {
        customer,
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: 'pending',
        totalAmount: grandTotal,
        shippingRecipientName: address.recipientName,
        shippingPhone: address.phone,
        shippingAddress: address.address,
        shippingCity: address.city,
        shippingPostalCode: address.postalCode,
        items,
      });
      const savedOrder = await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Gagal memproses checkout: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      // WAJIB: kembalikan koneksi ke pool
      await queryRunner.release();
    }
  }

  // Membatalkan pesanan + mengembalikan stok dalam satu transaksi
  async cancel(id: string): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Kunci baris order agar tidak bisa dibatalkan dua kali bersamaan
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) {
        throw new NotFoundException(`Pesanan ${id} tidak ditemukan`);
      }
      if (order.status === 'cancelled') {
        throw new BadRequestException('Pesanan sudah dibatalkan sebelumnya');
      }
      if (order.status === 'shipped' || order.status === 'completed') {
        throw new BadRequestException(
          'Pesanan yang sudah dikirim tidak bisa dibatalkan',
        );
      }

      const items = await queryRunner.manager.find(OrderItem, {
        where: { order: { id } },
        relations: { book: true },
        withDeleted: true,
      });

      for (const item of items) {
        await queryRunner.manager.increment(
          Book,
          { id: item.book.id },
          'stock',
          item.quantity,
        );
      }

      order.status = 'cancelled';
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Gagal membatalkan pesanan: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      await queryRunner.release();
    }
  }
}
