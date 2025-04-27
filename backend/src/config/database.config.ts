import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import { Author } from '../authors/entities/author.entity';
import { Loan } from '../loans/entities/loan.entity';

const logger = new Logger('DatabaseConfig');

export const getDatabaseConfig = async (): Promise<TypeOrmModuleOptions> => {
  // Try to connect to the remote database first
  const remoteUrl = process.env.DATABASE_URL;
  
  // Fallback to using an in-memory SQLite database if the Postgres connection fails
  const entities = [User, Book, Author, Loan];
  
  logger.log('Configuring database connection...');
  
  try {
    return {
      type: 'postgres',
      url: remoteUrl,
      entities,
      synchronize: true, // Only in development
      ssl: {
        rejectUnauthorized: false,
      },
      retryAttempts: 5,
      retryDelay: 3000,
      logging: ['error', 'warn'],
    };
  } catch (error) {
    logger.error(`Failed to configure postgres connection: ${error.message}`);
    logger.warn('Falling back to SQLite in-memory database');
    
    return {
      type: 'better-sqlite3',
      database: ':memory:',
      entities,
      synchronize: true,
      logging: ['error', 'warn'],
    };
  }
};
