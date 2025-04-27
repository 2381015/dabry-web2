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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger('AuthService');
    }
    async register(registerDto) {
        const { name, email, password } = registerDto;
        const userExists = await this.usersService.findByEmail(email);
        if (userExists) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        this.logger.debug(`Registration: ${email} - Hash: ${hashedPassword.substring(0, 20)}...`);
        const user = await this.usersService.create({
            name,
            email,
            password: hashedPassword,
        });
        const { password: _, ...result } = user;
        return result;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        this.logger.debug(`Login attempt for: ${email}`);
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                this.logger.warn(`User not found: ${email}`);
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            this.logger.debug(`User found: ${user.email}, hash: ${user.password.substring(0, 20)}...`);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            this.logger.debug(`Password comparison result: ${isPasswordValid}`);
            this.logger.debug(`Input password: "${password}", length: ${password.length}`);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = { sub: user.id, email: user.email, role: user.role };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            };
        }
        catch (error) {
            this.logger.error(`Login error: ${error.message}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map