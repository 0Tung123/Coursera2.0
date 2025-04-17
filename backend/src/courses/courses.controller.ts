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
} from "@nestjs/common"
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger"
import { CoursesService } from "./courses.service"
import { Course } from "./entities/course.entity"
import { CreateCourseDto } from "./dto/create-course.dto"
import { UpdateCourseDto } from "./dto/update-course.dto"
import { HttpExceptionFilter } from "../common/filters/http-exception.filter"
import { TransformInterceptor } from "../common/interceptors/transform.interceptor"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { Public } from "../auth/decorators/public.decorator"
import { UserRole } from "../users/entities/user.entity"

@ApiTags("Courses")
@Controller("courses")
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "Lấy danh sách tất cả khóa học" })
  @ApiResponse({
    status: 200,
    description: "Danh sách khóa học",
    type: [Course],
  })
  findAll(): Promise<Course[]> {
    return this.coursesService.findAll()
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Lấy thông tin chi tiết khóa học" })
  @ApiParam({ name: "id", description: "ID của khóa học" })
  @ApiResponse({ status: 200, description: "Thông tin khóa học", type: Course })
  @ApiResponse({ status: 404, description: "Không tìm thấy khóa học" })
  async findOne(@Param("id") id: string): Promise<Course> {
    const course = await this.coursesService.findOne(id)
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }
    return course
  }

  @Post()
  @ApiOperation({ summary: "Tạo mới khóa học" })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 201,
    description: "Khóa học đã được tạo",
    type: Course,
  })
  @ApiResponse({ status: 400, description: "Dữ liệu không hợp lệ" })
  @ApiResponse({ status: 401, description: "Không được phép" })
  @ApiResponse({ status: 403, description: "Không có quyền" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.createCourse(createCourseDto)
  }

  @Put(":id")
  @ApiOperation({ summary: "Cập nhật thông tin khóa học" })
  @ApiParam({ name: "id", description: "ID của khóa học cần cập nhật" })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({
    status: 200,
    description: "Khóa học đã được cập nhật",
    type: Course,
  })
  @ApiResponse({ status: 400, description: "Dữ liệu không hợp lệ" })
  @ApiResponse({ status: 401, description: "Không được phép" })
  @ApiResponse({ status: 403, description: "Không có quyền" })
  @ApiResponse({ status: 404, description: "Không tìm thấy khóa học" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.coursesService.findOne(id)
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }
    return this.coursesService.updateCourse(id, updateCourseDto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xóa khóa học" })
  @ApiParam({ name: "id", description: "ID của khóa học cần xóa" })
  @ApiResponse({ status: 200, description: "Khóa học đã được xóa" })
  @ApiResponse({ status: 401, description: "Không được phép" })
  @ApiResponse({ status: 403, description: "Không có quyền" })
  @ApiResponse({ status: 404, description: "Không tìm thấy khóa học" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param("id") id: string): Promise<void> {
    const course = await this.coursesService.findOne(id)
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }
    return this.coursesService.removeCourse(id)
  }
}
