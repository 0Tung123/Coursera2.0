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
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto } from "../users/dto/login.dto"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { HttpExceptionFilter } from "../common/filters/http-exception.filter"
import { TransformInterceptor } from "../common/interceptors/transform.interceptor"
import { Public } from "./decorators/public.decorator"
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger"
import { User } from "../users/entities/user.entity"
import { ForgotPasswordDto } from "src/users/dto/fogotPassword.dto"

@ApiTags("auth")
@Controller("auth")
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "Forgot password",
    description: "Send password reset email to user",
  })
  @Public()
  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email)
  }

  @ApiOperation({
    summary: "User login",
    description: "Authenticate a user and return a JWT token",
  })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    schema: {
      properties: {
        accessToken: { type: "string", description: "JWT access token" },
        user: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            role: { type: "string", enum: ["user", "instructor", "admin"] },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @Public()
  @Post("login")
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @ApiOperation({
    summary: "Register new user",
    description: "Register a new user and send verification email",
  })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 400, description: "Bad request - validation error" })
  @ApiResponse({ status: 409, description: "Conflict - email already exists" })
  @Public()
  @Post("register")
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto)
    return {
      message:
        "Registration successful. Please check your email to verify your account.",
      userId: user.user_id,
    }
  }

  @ApiOperation({
    summary: "Verify email",
    description: "Verify user email with token",
  })
  @ApiQuery({
    name: "token",
    description: "Email verification token",
    required: true,
  })
  @ApiResponse({ status: 200, description: "Email verified successfully" })
  @ApiResponse({
    status: 404,
    description: "Verification token not found or expired",
  })
  @Public()
  @Get("verify-email")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Query("token") token: string) {
    await this.authService.verifyEmail(token)
    return { message: "Email verified successfully. You can now log in." }
  }

  @ApiOperation({
    summary: "Get user profile",
    description: "Get the profile of the currently authenticated user",
  })
  @ApiResponse({
    status: 200,
    description: "Profile retrieved successfully",
    type: User,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId)
  }
}
