import { IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { LoanStatus } from '../entities/loan.entity';

export class CreateLoanDto {
  @IsNumber()
  book_id: number;

  @IsNumber()
  user_id: number;

  @IsDateString()
  loan_date: string;

  @IsDateString()
  return_date: string;

  @IsEnum(LoanStatus)
  @IsOptional()
  status?: LoanStatus;
}
