import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { User, UserRole } from './users/entities/user.entity';
import { getRepository } from 'typeorm';
import { Author } from './authors/entities/author.entity';
import { Book } from './books/entities/book.entity';

async function seed() {
  const logger = new Logger('Seeder');
  const app = await NestFactory.create(AppModule);
  const userRepository = getRepository(User);
  const authorRepository = getRepository(Author);
  const bookRepository = getRepository(Book);

  // Create admin user
  const adminExists = await userRepository.findOne({ where: { email: 'admin@library.com' } });
  if (!adminExists) {
    const adminUser = userRepository.create({
      name: 'Admin',
      email: 'admin@library.com',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
    });
    await userRepository.save(adminUser);
    logger.log('Admin user created');
  }

  // Create some authors
  const authors = [
    { name: 'George Orwell', biography: 'English novelist, essayist, journalist, and critic.' },
    { name: 'Harper Lee', biography: 'American novelist best known for To Kill a Mockingbird.' },
    { name: 'F. Scott Fitzgerald', biography: 'American novelist and short story writer.' },
    { name: 'Jane Austen', biography: 'English novelist known primarily for her six major novels.' },
  ];

  for (const authorData of authors) {
    const exists = await authorRepository.findOne({ where: { name: authorData.name } });
    if (!exists) {
      const author = authorRepository.create(authorData);
      await authorRepository.save(author);
      logger.log(`Author ${author.name} created`);
    }
  }

  // Get authors for creating books
  const savedAuthors = await authorRepository.find();

  // Create some books
  const books = [
    { 
      title: '1984',
      author: savedAuthors.find(a => a.name === 'George Orwell'), 
      publication_year: 1949,
      stock_quantity: 5
    },
    { 
      title: 'To Kill a Mockingbird',
      author: savedAuthors.find(a => a.name === 'Harper Lee'), 
      publication_year: 1960,
      stock_quantity: 3
    },
    { 
      title: 'The Great Gatsby',
      author: savedAuthors.find(a => a.name === 'F. Scott Fitzgerald'), 
      publication_year: 1925,
      stock_quantity: 4
    },
    { 
      title: 'Pride and Prejudice',
      author: savedAuthors.find(a => a.name === 'Jane Austen'), 
      publication_year: 1813,
      stock_quantity: 2
    }
  ];

  for (const bookData of books) {
    if (bookData.author) {
      const exists = await bookRepository.findOne({ 
        where: { 
          title: bookData.title,
          author: { id: bookData.author.id }
        },
        relations: ['author']
      });
      
      if (!exists) {
        const book = bookRepository.create(bookData);
        await bookRepository.save(book);
        logger.log(`Book ${book.title} created`);
      }
    }
  }

  await app.close();
  logger.log('Seeding completed');
}

seed();
