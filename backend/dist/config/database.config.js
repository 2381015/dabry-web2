"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users/entities/user.entity");
const book_entity_1 = require("../books/entities/book.entity");
const author_entity_1 = require("../authors/entities/author.entity");
const loan_entity_1 = require("../loans/entities/loan.entity");
const logger = new common_1.Logger('DatabaseConfig');
const getDatabaseConfig = async () => {
    const remoteUrl = process.env.DATABASE_URL;
    const entities = [user_entity_1.User, book_entity_1.Book, author_entity_1.Author, loan_entity_1.Loan];
    logger.log('Configuring database connection...');
    try {
        return {
            type: 'postgres',
            url: remoteUrl,
            entities,
            synchronize: true,
            ssl: {
                rejectUnauthorized: false,
            },
            retryAttempts: 5,
            retryDelay: 3000,
            logging: ['error', 'warn'],
        };
    }
    catch (error) {
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
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map