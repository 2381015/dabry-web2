"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("./entities/book.entity");
const authors_service_1 = require("../authors/authors.service");
let BooksService = class BooksService {
    constructor(booksRepository, authorsService) {
        this.booksRepository = booksRepository;
        this.authorsService = authorsService;
    }
    async create(createBookDto) {
        const { author_id, ...bookData } = createBookDto;
        const author = await this.authorsService.findOne(author_id);
        const book = this.booksRepository.create({
            ...bookData,
            author,
        });
        return this.booksRepository.save(book);
    }
    async findAll() {
        return this.booksRepository.find({
            relations: ['author'],
        });
    }
    async findOne(id) {
        const book = await this.booksRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!book) {
            throw new common_1.NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }
    async update(id, updateBookDto) {
        const book = await this.findOne(id);
        if (updateBookDto.author_id) {
            const author = await this.authorsService.findOne(updateBookDto.author_id);
            book.author = author;
            delete updateBookDto.author_id;
        }
        Object.assign(book, updateBookDto);
        return this.booksRepository.save(book);
    }
    async remove(id) {
        const book = await this.findOne(id);
        await this.booksRepository.remove(book);
    }
    async updateStock(id, quantity) {
        const book = await this.findOne(id);
        book.stock_quantity = quantity;
        return this.booksRepository.save(book);
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        authors_service_1.AuthorsService])
], BooksService);
//# sourceMappingURL=books.service.js.map