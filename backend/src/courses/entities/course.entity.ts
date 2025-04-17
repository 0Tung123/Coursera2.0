import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { UserCourse } from "../../users/entities/user-course.entity"
import { ApiProperty } from "@nestjs/swagger"

@Entity()
export class Course {
  @ApiProperty({
    description: "Unique identifier for the course",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @PrimaryGeneratedColumn("uuid")
  Course_id: string

  @ApiProperty({
    description: "Title of the course",
    example: "Introduction to Programming",
  })
  @Column()
  title: string

  @ApiProperty({
    description: "Detailed description of the course",
    example:
      "Learn the fundamentals of programming with this comprehensive course",
  })
  @Column()
  description: string

  @ApiProperty({
    description: "Name of the course instructor",
    example: "John Doe",
    required: false,
  })
  @Column({ nullable: true })
  instructor: string

  @ApiProperty({
    description: "URL to the course image",
    example: "https://example.com/course-image.jpg",
    required: false,
  })
  @Column({ nullable: true })
  imageUrl: string

  @ApiProperty({
    description: "Average rating of the course (0-5)",
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  @Column({ default: 0 })
  rating: number

  @ApiProperty({
    description: "Date and time when the course was created",
    example: "2023-01-01T00:00:00Z",
  })
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @ApiProperty({
    description: "Users enrolled in this course",
    type: [UserCourse],
    required: false,
  })
  @OneToMany(() => UserCourse, (userCourse) => userCourse.course)
  users: UserCourse[]
}
