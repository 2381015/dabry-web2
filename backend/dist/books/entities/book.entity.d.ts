import { Author } from '../../authors/entities/author.entity';
import { Loan } from '../../loans/entities/loan.entity';
export declare class Book {
    id: number;
    title: string;
    author: Author;
    publication_year: number;
    stock_quantity: number;
    loans: Loan[];
}
