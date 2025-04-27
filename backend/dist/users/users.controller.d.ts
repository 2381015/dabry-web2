import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    private logger;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<void>;
    makeAdmin(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: UserRole.ADMIN;
        };
    } | {
        success: boolean;
        message: any;
        user?: undefined;
    }>;
}
