"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const app_module_1 = require("./app.module");
const user_entity_1 = require("./users/entities/user.entity");
const typeorm_1 = require("typeorm");
const author_entity_1 = require("./authors/entities/author.entity");
const book_entity_1 = require("./books/entities/book.entity");
async function seed() {
    const logger = new common_1.Logger('Seeder');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
    const authorRepository = (0, typeorm_1.getRepository)(author_entity_1.Author);
    const bookRepository = (0, typeorm_1.getRepository)(book_entity_1.Book);
    const adminExists = await userRepository.findOne({ where: { email: 'admin@library.com' } });
    if (!adminExists) {
        const adminUser = userRepository.create({
            name: 'Admin',
            email: 'admin@library.com',
            password: await bcrypt.hash('admin123', 10),
            role: user_entity_1.UserRole.ADMIN,
        });
        await userRepository.save(adminUser);
        logger.log('Admin user created');
    }
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
    const savedAuthors = await authorRepository.find();
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
//# sourceMappingURL=seed.js.map