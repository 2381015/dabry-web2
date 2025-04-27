import { IsString, IsNumber, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsNumber()
  author_id: number;

  @IsNumber()
  publication_year: number;

  @IsNumber()
  @Min(0)
  stock_quantity: number;
}
