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
exports.LoansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loan_entity_1 = require("./entities/loan.entity");
const books_service_1 = require("../books/books.service");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
let LoansService = class LoansService {
    constructor(loansRepository, booksService, usersService) {
        this.loansRepository = loansRepository;
        this.booksService = booksService;
        this.usersService = usersService;
    }
    async create(createLoanDto) {
        const { book_id, user_id } = createLoanDto;
        const book = await this.booksService.findOne(book_id);
        if (book.stock_quantity <= 0) {
            throw new common_1.BadRequestException('Book is out of stock');
        }
        const user = await this.usersService.findOne(user_id);
        const status = createLoanDto.status || loan_entity_1.LoanStatus.PENDING;
        const loan = this.loansRepository.create({
            ...createLoanDto,
            book,
            user,
            status,
        });
        if (status === loan_entity_1.LoanStatus.BORROWED) {
            await this.booksService.updateStock(book.id, book.stock_quantity - 1);
        }
        return this.loansRepository.save(loan);
    }
    async findAll() {
        return this.loansRepository.find({
            relations: ['book', 'user'],
        });
    }
    async findByUserId(userId) {
        return this.loansRepository.find({
            where: { user: { id: userId } },
            relations: ['book', 'user'],
        });
    }
    async findOne(id, user) {
        const loan = await this.loansRepository.findOne({
            where: { id },
            relations: ['book', 'user'],
        });
        if (!loan) {
            throw new common_1.NotFoundException(`Loan with ID ${id} not found`);
        }
        if (user && user.role !== user_entity_1.UserRole.ADMIN && loan.user.id !== user.id) {
            throw new common_1.BadRequestException('You can only access your own loans');
        }
        return loan;
    }
    async update(id, updateLoanDto) {
        const loan = await this.findOne(id);
        const oldStatus = loan.status;
        if (updateLoanDto.book_id && updateLoanDto.book_id !== loan.book.id) {
            const book = await this.booksService.findOne(updateLoanDto.book_id);
            loan.book = book;
            delete updateLoanDto.book_id;
        }
        if (updateLoanDto.user_id && updateLoanDto.user_id !== loan.user.id) {
            const user = await this.usersService.findOne(updateLoanDto.user_id);
            loan.user = user;
            delete updateLoanDto.user_id;
        }
        Object.assign(loan, updateLoanDto);
        const updatedLoan = await this.loansRepository.save(loan);
        if (updateLoanDto.status && oldStatus !== updateLoanDto.status) {
            await this.handleStatusChange(loan, oldStatus, updateLoanDto.status);
        }
        return updatedLoan;
    }
    async updateStatus(id, status, user) {
        const loan = await this.findOne(id, user);
        const oldStatus = loan.status;
        if (!Object.values(loan_entity_1.LoanStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid status value');
        }
        if (user.role !== user_entity_1.UserRole.ADMIN) {
            if (status !== loan_entity_1.LoanStatus.RETURNED) {
                throw new common_1.BadRequestException('You can only mark your loans as returned');
            }
            if (loan.user.id !== user.id) {
                throw new common_1.BadRequestException('You can only update your own loans');
            }
        }
        loan.status = status;
        const updatedLoan = await this.loansRepository.save(loan);
        await this.handleStatusChange(loan, oldStatus, status);
        return updatedLoan;
    }
    async remove(id) {
        const loan = await this.findOne(id);
        await this.loansRepository.remove(loan);
    }
    async handleStatusChange(loan, oldStatus, newStatus) {
        if (newStatus === loan_entity_1.LoanStatus.BORROWED && oldStatus !== loan_entity_1.LoanStatus.BORROWED) {
            const book = await this.booksService.findOne(loan.book.id);
            if (book.stock_quantity <= 0) {
                throw new common_1.BadRequestException('Book is out of stock');
            }
            await this.booksService.updateStock(book.id, book.stock_quantity - 1);
        }
        if (oldStatus === loan_entity_1.LoanStatus.BORROWED && newStatus !== loan_entity_1.LoanStatus.BORROWED) {
            const book = await this.booksService.findOne(loan.book.id);
            await this.booksService.updateStock(book.id, book.stock_quantity + 1);
        }
    }
};
exports.LoansService = LoansService;
exports.LoansService = LoansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        books_service_1.BooksService,
        users_service_1.UsersService])
], LoansService);
//# sourceMappingURL=loans.service.js.map