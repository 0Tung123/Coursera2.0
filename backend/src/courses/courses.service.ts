import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Course } from "./entities/course.entity"
import { CreateCourseDto } from "./dto/create-course.dto"
import { UpdateCourseDto } from "./dto/update-course.dto"

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find()
  }

  async findOne(course_id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: {
        Course_id: course_id,
      },
    })
    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`)
    }
    return course
  }
  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const course = this.coursesRepository.create(createCourseDto)
      return await this.coursesRepository.save(course)
    } catch (error) {
      throw new BadRequestException(`Failed to create course: ${error.message}`)
    }
  }

  async updateCourse(
    course_id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    try {
      const course = await this.coursesRepository.findOne({
        where: {
          Course_id: course_id,
        },
      })
      if (!course) {
        throw new NotFoundException(`Course with ID ${course_id} not found`)
      }

      // Merge the update data with the existing course
      Object.assign(course, updateCourseDto)

      // Save the updated course
      return await this.coursesRepository.save(course)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(`Failed to update course: ${error.message}`)
    }
  }

  async removeCourse(course_id: string): Promise<void> {
    try {
      const course = await this.coursesRepository.findOne({
        where: {
          Course_id: course_id,
        },
      })
      if (!course) {
        throw new NotFoundException(`Course with ID ${course_id} not found`)
      }

      // Remove the course
      await this.coursesRepository.remove(course)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(`Failed to remove course: ${error.message}`)
    }
  }
}
