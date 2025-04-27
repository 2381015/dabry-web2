import { Book } from '../../books/entities/book.entity';
export declare class Author {
    id: number;
    name: string;
    biography: string;
    books: Book[];
}
