import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // Check if user already exists
    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    // Hash password with explicit salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    
    this.logger.debug(`Registration: ${email} - Hash: ${hashedPassword.substring(0, 20)}...`);

    // Create user
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    this.logger.debug(`Login attempt for: ${email}`);

    try {
      // Find user
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        this.logger.warn(`User not found: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      
      this.logger.debug(`User found: ${user.email}, hash: ${user.password.substring(0, 20)}...`);

      // Verify password - use direct string comparison for debug
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      this.logger.debug(`Password comparison result: ${isPasswordValid}`);
      this.logger.debug(`Input password: "${password}", length: ${password.length}`);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate token
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
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
