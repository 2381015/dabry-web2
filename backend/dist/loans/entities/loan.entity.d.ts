import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';
export declare enum LoanStatus {
    PENDING = "pending",
    BORROWED = "borrowed",
    RETURNED = "returned"
}
export declare class Loan {
    id: number;
    user: User;
    book: Book;
    loan_date: Date;
    return_date: Date;
    status: LoanStatus;
}
