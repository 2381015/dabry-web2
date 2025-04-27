import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    private logger;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: any): Promise<{
        role: string;
        id: number;
        name: string;
        email: string;
        loans: import("../../loans/entities/loan.entity").Loan[];
    } | {
        id: any;
        email: any;
        name: any;
        role: string;
    }>;
}
export {};
