import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() createLoanDto: CreateLoanDto, @GetUser() user: User) {
    // Regular users can only create loans for themselves
    if (user.role === UserRole.USER && createLoanDto.user_id !== user.id) {
      createLoanDto.user_id = user.id;
    }
    return this.loansService.create(createLoanDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.loansService.findAll();
  }

  @Get('user/:userId')
  getUserLoans(@Param('userId') userId: string, @GetUser() user: User) {
    // Check if user is requesting their own loans or is admin
    if (user.role === UserRole.USER && +userId !== user.id) {
      return { message: 'Unauthorized', loans: [] };
    }
    return this.loansService.findByUserId(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.loansService.findOne(+id, user);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.update(+id, updateLoanDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() statusUpdate: { status: string },
    @GetUser() user: User,
  ) {
    return this.loansService.updateStatus(+id, statusUpdate.status, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.loansService.remove(+id);
  }
}
