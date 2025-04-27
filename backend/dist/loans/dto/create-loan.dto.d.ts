import { LoanStatus } from '../entities/loan.entity';
export declare class CreateLoanDto {
    book_id: number;
    user_id: number;
    loan_date: string;
    return_date: string;
    status?: LoanStatus;
}
