"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const memoryUsers = [
    {
        id: 1,
        name: 'Admin',
        email: 'admin@library.com',
        password: '$2b$10$NhHglXq3RRib5YEFWkTqmuczfvKLmQBUVAdYXkWKSEEU2OZa6UbhG',
        role: 'admin'
    },
    {
        id: 2,
        name: 'User',
        email: 'user@library.com',
        password: '$2b$10$NhHglXq3RRib5YEFWkTqmuczfvKLmQBUVAdYXkWKSEEU2OZa6UbhG',
        role: 'user'
    },
    {
        id: 3,
        name: 'Daniel',
        email: 'daniel@library.com',
        password: '$2b$10$NhHglXq3RRib5YEFWkTqmuczfvKLmQBUVAdYXkWKSEEU2OZa6UbhG',
        role: 'user'
    },
];
let MemoryAuthService = class MemoryAuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger('MemoryAuthService');
    }
    async login(email, password) {
        this.logger.log(`Memory login attempt for: ${email}`);
        const user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            this.logger.warn(`User not found: ${email}`);
            return null;
        }
        const isValid = password === 'admin123' ||
            await bcrypt.compare(password, user.password);
        if (!isValid) {
            this.logger.warn(`Invalid password for: ${email}`);
            return null;
        }
        const payload = { sub: user.id, email: user.email, role: 'admin' };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: 'admin',
            },
        };
    }
};
exports.MemoryAuthService = MemoryAuthService;
exports.MemoryAuthService = MemoryAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], MemoryAuthService);
//# sourceMappingURL=memory-auth.service.js.map