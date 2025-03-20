import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseFilters,
  NotFoundException,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { HttpExceptionFilter } from "../common/filters/http-exception.filter";
import { TransformInterceptor } from "../common/interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "./entities/user.entity";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: "Get all users",
    description: "Retrieve a list of all users. Requires admin role.",
  })
  @ApiResponse({
    status: 200,
    description: "List of users retrieved successfully",
    type: [User],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - requires admin role" })
  @ApiBearerAuth("JWT-auth")
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: "Get user by ID",
    description: "Retrieve a specific user by their ID",
  })
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "User retrieved successfully",
    type: User,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiBearerAuth("JWT-auth")
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @ApiOperation({
    summary: "Create new user",
    description: "Create a new user account",
  })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: User,
  })
  @ApiResponse({ status: 400, description: "Bad request - validation error" })
  @ApiResponse({ status: 409, description: "Conflict - email already exists" })
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: "Update user",
    description: "Update an existing user by ID",
  })
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: User,
  })
  @ApiResponse({ status: 400, description: "Bad request - validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 409, description: "Conflict - email already exists" })
  @ApiBearerAuth("JWT-auth")
  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({
    summary: "Delete user",
    description: "Delete a user by ID. Requires admin role.",
  })
  @ApiParam({ name: "id", description: "User ID", type: "string" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - requires admin role" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiBearerAuth("JWT-auth")
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param("id") id: string): Promise<void> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.usersService.remove(id);
  }
}
