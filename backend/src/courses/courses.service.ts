import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "./entities/course.entity";

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>
  ) {}

  findAll(): Promise<Course[]> {
    return this.coursesRepository.find();
  }

  findOne(id: string): Promise<Course> {
    return this.coursesRepository.findOne({ where: { id } });
  }

  async create(course: Partial<Course>): Promise<Course> {
    const newCourse = this.coursesRepository.create(course);
    return this.coursesRepository.save(newCourse);
  }

  async update(id: string, course: Partial<Course>): Promise<Course> {
    await this.coursesRepository.update(id, course);
    return this.coursesRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.coursesRepository.delete(id);
  }
}
