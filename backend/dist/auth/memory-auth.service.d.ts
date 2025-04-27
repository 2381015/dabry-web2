import { JwtService } from '@nestjs/jwt';
export declare class MemoryAuthService {
    private jwtService;
    private logger;
    constructor(jwtService: JwtService);
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
}
