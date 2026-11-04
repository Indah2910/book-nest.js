import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, QueryFailedError, Repository } from 'typeorm';
import { Book } from './entities/book-entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

const BOOK_RELATIONS: FindOptionsRelations<Book> = {
  category: true,
  publisher: true,
  authors: true,
};

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // SELECT semua buku beserta kategori, penerbit, dan penulisnya
  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find({
      relations: BOOK_RELATIONS,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: BOOK_RELATIONS,
    });
    if (!book) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }
    return book;
  }

  async create(dto: CreateBookDto): Promise<Book> {
    const { categoryId, publisherId, authorIds, ...data } = dto;
    const book = this.bookRepository.create({
      ...data,
      category: categoryId ? { id: categoryId } : undefined,
      publisher: publisherId ? { id: publisherId } : undefined,
      authors: authorIds?.map((authorId) => ({ id: authorId })),
    });
    const saved = await this.save(book);
    return await this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }

    const { categoryId, publisherId, authorIds, ...data } = dto;
    this.bookRepository.merge(book, {
      ...data,
      ...(categoryId !== undefined && { category: { id: categoryId } }),
      ...(publisherId !== undefined && { publisher: { id: publisherId } }),
      ...(authorIds !== undefined && {
        authors: authorIds.map((authorId) => ({ id: authorId })),
      }),
    });

    await this.save(book);
    return await this.findOne(id);
  }

  // Soft delete (hanya mengisi kolom deleted_at)
  async remove(id: string) {
    const book = await this.findOne(id);
    await this.bookRepository.softDelete(id);
    return { message: `Buku "${book.title}" berhasil dihapus`, deletedId: id };
  }

  // Memulihkan buku yang di-soft delete
  async restore(id: string) {
    const result = await this.bookRepository.restore(id);
    if (!result.affected) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }
    return { message: `Buku ${id} berhasil dipulihkan` };
  }

  // Menerjemahkan error constraint PostgreSQL menjadi pesan yang jelas
  private async save(book: Book): Promise<Book> {
    try {
      return await this.bookRepository.save(book);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const code = (error.driverError as unknown as { code?: string })?.code;
        if (code === '23505') {
          throw new ConflictException('ISBN sudah terdaftar');
        }
        if (code === '23503') {
          throw new BadRequestException(
            'categoryId, publisherId, atau authorIds tidak ditemukan',
          );
        }
      }
      throw error;
    }
  }
}
