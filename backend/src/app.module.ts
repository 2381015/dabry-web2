import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { AuthorsModule } from './authors/authors.module';
import { LoansModule } from './loans/loans.module';
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { Author } from './authors/entities/author.entity';
import { Loan } from './loans/entities/loan.entity';
import { AppController } from './app.controller';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return getDatabaseConfig();
      },
      inject: [ConfigService],
    }),
    AuthModule,
    BooksModule,
    UsersModule,
    AuthorsModule,
    LoansModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
