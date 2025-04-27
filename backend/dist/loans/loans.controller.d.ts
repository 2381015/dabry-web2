import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { User } from '../users/entities/user.entity';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    create(createLoanDto: CreateLoanDto, user: User): Promise<import("./entities/loan.entity").Loan>;
    findAll(): Promise<import("./entities/loan.entity").Loan[]>;
    getUserLoans(userId: string, user: User): Promise<import("./entities/loan.entity").Loan[]> | {
        message: string;
        loans: any[];
    };
    findOne(id: string, user: User): Promise<import("./entities/loan.entity").Loan>;
    update(id: string, updateLoanDto: UpdateLoanDto): Promise<import("./entities/loan.entity").Loan>;
    updateStatus(id: string, statusUpdate: {
        status: string;
    }, user: User): Promise<import("./entities/loan.entity").Loan>;
    remove(id: string): Promise<void>;
}
