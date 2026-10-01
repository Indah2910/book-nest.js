import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { GetBookDto } from './dto/get-book.dto.js';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    //Menampilkan semua data buku
    @Get()
    getbooks() {
        return this.booksService.findAll();
    }

    //Menambahkan data buku baru
    @Post()
    createBook(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    //Menampilkan data buku berdasarkan id (belum bener)
    @Get()
    getBookById(@Body() getBookDto: GetBookDto){
        return this.booksService.get(getBookDto);
    }

    //Update data buku 
    @Put(':id')
    updateBook(@Param('id') id: string): string{
        return `Data buku dengan id: $(id) berhasil diperbarui`
    }

    //Menghapus data buku
    @Delete(':id')
    deleteBook(@Param('id') id: string): string{
        return `Data buku dengan id: $(id) berhasil dihapus`
    }
}
