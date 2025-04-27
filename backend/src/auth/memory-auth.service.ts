import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// In-memory user store for when database is not available
const memoryUsers = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@library.com',
    password: '$2b$10$NhHglXq3RRib5YEFWkTqmuczfvKLmQBUVAdYXkWKSEEU2OZa6UbhG', // admin123
    role: 'admin'
  },
  {
    id: 2,
    name: 'User',
    email: 'user@library.com',
    password: '$2b$10$NhHglXq3RRib5YEFWkTqmuczfvKLmQBUVAdYXkWKSEEU2OZa6UbhG', // admin123
    role: 'user'
  },
  {
    id: 3,
    name: 'Daniel',
    email: 'daniel@library.com',
    password: '$2b$10$NhHglXq3RRib5YEFWkTqmuczfvKLmQBUVAdYXkWKSEEU2OZa6UbhG', // admin123
    role: 'user'
  },
];

@Injectable()
export class MemoryAuthService {
  private logger = new Logger('MemoryAuthService');

  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    this.logger.log(`Memory login attempt for: ${email}`);
    
    // Find user in memory store
    const user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      return null;
    }
    
    // Check if admin123 is used (hardcoded backdoor for testing)
    const isValid = password === 'admin123' || 
                   await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      this.logger.warn(`Invalid password for: ${email}`);
      return null;
    }
    
    // Generate token - ALWAYS SET ROLE TO ADMIN FOR TESTING
    const payload = { sub: user.id, email: user.email, role: 'admin' };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        // Override role to admin for testing purposes
        role: 'admin',
      },
    };
  }
}
