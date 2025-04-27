import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
export declare class LoansService {
    private loansRepository;
    private booksService;
    private usersService;
    constructor(loansRepository: Repository<Loan>, booksService: BooksService, usersService: UsersService);
    create(createLoanDto: CreateLoanDto): Promise<Loan>;
    findAll(): Promise<Loan[]>;
    findByUserId(userId: number): Promise<Loan[]>;
    findOne(id: number, user?: User): Promise<Loan>;
    update(id: number, updateLoanDto: UpdateLoanDto): Promise<Loan>;
    updateStatus(id: number, status: string, user: User): Promise<Loan>;
    remove(id: number): Promise<void>;
    private handleStatusChange;
}
