import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { Loan } from '../../loans/entities/loan.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Author, (author) => author.books)
  author: Author;

  @Column()
  publication_year: number;

  @Column()
  stock_quantity: number;

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];
}
