import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorsService } from '../authors/authors.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private authorsService: AuthorsService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { author_id, ...bookData } = createBookDto;
    
    // Get author
    const author = await this.authorsService.findOne(author_id);
    
    // Create and save book
    const book = this.booksRepository.create({
      ...bookData,
      author,
    });
    
    return this.booksRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find({
      relations: ['author'],
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    
    // Handle author update if needed
    if (updateBookDto.author_id) {
      const author = await this.authorsService.findOne(updateBookDto.author_id);
      book.author = author;
      delete updateBookDto.author_id;
    }
    
    // Update other fields
    Object.assign(book, updateBookDto);
    
    return this.booksRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }

  async updateStock(id: number, quantity: number): Promise<Book> {
    const book = await this.findOne(id);
    book.stock_quantity = quantity;
    return this.booksRepository.save(book);
  }
}
