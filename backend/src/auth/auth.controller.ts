import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../users/dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { HttpExceptionFilter } from "../common/filters/http-exception.filter";
import { TransformInterceptor } from "../common/interceptors/transform.interceptor";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { User } from "../users/entities/user.entity";

@ApiTags('auth')
@Controller("auth")
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login', description: 'Authenticate a user and return a JWT token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful', 
    schema: {
      properties: {
        accessToken: { type: 'string', description: 'JWT access token' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['user', 'instructor', 'admin'] }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post("login")
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Get user profile', description: 'Get the profile of the currently authenticated user' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
