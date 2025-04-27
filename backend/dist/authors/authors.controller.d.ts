import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
export declare class AuthorsController {
    private readonly authorsService;
    constructor(authorsService: AuthorsService);
    create(createAuthorDto: CreateAuthorDto): Promise<import("./entities/author.entity").Author>;
    findAll(): Promise<import("./entities/author.entity").Author[]>;
    findOne(id: string): Promise<import("./entities/author.entity").Author>;
    update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<import("./entities/author.entity").Author>;
    remove(id: string): Promise<void>;
}
