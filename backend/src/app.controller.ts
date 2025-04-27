import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): { message: string } {
    return { message: 'Library Management API v1' };
  }
  
  @Get('api')
  getApi(): { status: string, version: string } {
    return { 
      status: 'online', 
      version: '1.0.0' 
    };
  }
}
