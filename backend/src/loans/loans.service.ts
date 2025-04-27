import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan, LoanStatus } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
    private booksService: BooksService,
    private usersService: UsersService,
  ) {}

  async create(createLoanDto: CreateLoanDto): Promise<Loan> {
    const { book_id, user_id } = createLoanDto;
    
    // Get book and check stock
    const book = await this.booksService.findOne(book_id);
    if (book.stock_quantity <= 0) {
      throw new BadRequestException('Book is out of stock');
    }
    
    // Get user
    const user = await this.usersService.findOne(user_id);
    
    // Create loan with pending status by default
    const status = createLoanDto.status || LoanStatus.PENDING;
    const loan = this.loansRepository.create({
      ...createLoanDto,
      book,
      user,
      status,
    });
    
    // If status is immediately set to BORROWED, decrease book stock
    if (status === LoanStatus.BORROWED) {
      await this.booksService.updateStock(book.id, book.stock_quantity - 1);
    }
    
    return this.loansRepository.save(loan);
  }

  async findAll(): Promise<Loan[]> {
    return this.loansRepository.find({
      relations: ['book', 'user'],
    });
  }

  async findByUserId(userId: number): Promise<Loan[]> {
    return this.loansRepository.find({
      where: { user: { id: userId } },
      relations: ['book', 'user'],
    });
  }

  async findOne(id: number, user?: User): Promise<Loan> {
    const loan = await this.loansRepository.findOne({
      where: { id },
      relations: ['book', 'user'],
    });
    
    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }
    
    // Check if non-admin user is accessing another user's loan
    if (user && user.role !== UserRole.ADMIN && loan.user.id !== user.id) {
      throw new BadRequestException('You can only access your own loans');
    }
    
    return loan;
  }

  async update(id: number, updateLoanDto: UpdateLoanDto): Promise<Loan> {
    const loan = await this.findOne(id);
    const oldStatus = loan.status;
    
    // Handle book change if needed
    if (updateLoanDto.book_id && updateLoanDto.book_id !== loan.book.id) {
      const book = await this.booksService.findOne(updateLoanDto.book_id);
      loan.book = book;
      delete updateLoanDto.book_id;
    }
    
    // Handle user change if needed
    if (updateLoanDto.user_id && updateLoanDto.user_id !== loan.user.id) {
      const user = await this.usersService.findOne(updateLoanDto.user_id);
      loan.user = user;
      delete updateLoanDto.user_id;
    }
    
    // Update other fields
    Object.assign(loan, updateLoanDto);
    const updatedLoan = await this.loansRepository.save(loan);
    
    // Handle status change effects
    if (updateLoanDto.status && oldStatus !== updateLoanDto.status) {
      await this.handleStatusChange(loan, oldStatus, updateLoanDto.status);
    }
    
    return updatedLoan;
  }

  async updateStatus(id: number, status: string, user: User): Promise<Loan> {
    const loan = await this.findOne(id, user);
    const oldStatus = loan.status;
    
    // Check if this is a valid status
    if (!Object.values(LoanStatus).includes(status as LoanStatus)) {
      throw new BadRequestException('Invalid status value');
    }
    
    // Regular users can only return their own loans
    if (user.role !== UserRole.ADMIN) {
      if (status !== LoanStatus.RETURNED) {
        throw new BadRequestException('You can only mark your loans as returned');
      }
      if (loan.user.id !== user.id) {
        throw new BadRequestException('You can only update your own loans');
      }
    }
    
    loan.status = status as LoanStatus;
    const updatedLoan = await this.loansRepository.save(loan);
    
    // Handle stock updates if status changed
    await this.handleStatusChange(loan, oldStatus, status as LoanStatus);
    
    return updatedLoan;
  }

  async remove(id: number): Promise<void> {
    const loan = await this.findOne(id);
    await this.loansRepository.remove(loan);
  }

  // Helper method to handle stock updates when loan status changes
  private async handleStatusChange(loan: Loan, oldStatus: string, newStatus: string): Promise<void> {
    // When a loan becomes "borrowed", decrease book stock
    if (newStatus === LoanStatus.BORROWED && oldStatus !== LoanStatus.BORROWED) {
      const book = await this.booksService.findOne(loan.book.id);
      if (book.stock_quantity <= 0) {
        throw new BadRequestException('Book is out of stock');
      }
      await this.booksService.updateStock(book.id, book.stock_quantity - 1);
    }
    
    // When a loan is no longer "borrowed", increase book stock
    if (oldStatus === LoanStatus.BORROWED && newStatus !== LoanStatus.BORROWED) {
      const book = await this.booksService.findOne(loan.book.id);
      await this.booksService.updateStock(book.id, book.stock_quantity + 1);
    }
  }
}
