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
import { CoursesService } from "./courses.service";
import { Course } from "./entities/course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { HttpExceptionFilter } from "../common/filters/http-exception.filter";
import { TransformInterceptor } from "../common/interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("courses")
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Course> {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateCourseDto
  ): Promise<Course> {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param("id") id: string): Promise<void> {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return this.coursesService.remove(id);
  }
}
