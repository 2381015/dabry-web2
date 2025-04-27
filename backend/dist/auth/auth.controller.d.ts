import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private jwtService;
    private logger;
    private memoryAuthService;
    constructor(authService: AuthService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: import("../users/entities/user.entity").UserRole;
        loans: import("../loans/entities/loan.entity").Loan[];
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
    getProfile(req: any): any;
    directLogin(body: {
        email: string;
    }): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: import("../users/entities/user.entity").UserRole;
        };
        success?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        access_token?: undefined;
        user?: undefined;
    }>;
}
