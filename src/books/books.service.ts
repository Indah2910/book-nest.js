import { Injectable } from '@nestjs/common';
import { title } from 'process';
import { Book } from './entities/book-entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { GetBookDto } from './dto/get-book.dto.js';
import { DeleteBookDto } from './dto/delete-book.dto.js';

@Injectable() 
export class BooksService {
    delete(deleteBookDto: DeleteBookDto) {
        throw new Error('Method not implemented.');
    }
    //simpan ke database
    update //simpan ke database
        (updateBookDto: GetBookDto) {
            throw new Error('Method not implemented.');
    }
    private books: Book [] =[

        {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scroot Fitzgerald',
            isbn: '3984020405',
            publishedYear: 2019,
            isAvailable: true
        }
    ]

    //Mencari Semua Data 
    findAll(): Book[] {
        return this.books;
    }

    //Menyimpan data buku baru
    create(book: CreateBookDto): Book{
        const newBook = {
            id: this.books.length + 1,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publishedYear: book.publishrdYear,
            isAvailable: true
        }

        //simpan ke database
        this.books.push(newBook);

        return newBook;
    }

    //Menambahkan buku dengan id
    get(book: GetBookDto): Book{
        const newBook = {
            id: this.books.length + 1,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publishedYear: book.publishedYear,
            isAvailable: true
        }

        //simpan ke database
        this.books.push(newBook);

        return newBook;
    }
}
