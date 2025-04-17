import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm"
import { User } from "./user.entity"
import { Course } from "../../courses/entities/course.entity"

@Entity()
export class UserCourse {
  @PrimaryGeneratedColumn("uuid")
  userCourse_id: string

  @Column({ default: false })
  isPurchased: boolean

  @Column({ type: "timestamp", nullable: true })
  purchasedAt: Date

  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn({ name: "userId" })
  user: User

  @ManyToOne(() => Course, (course) => course.users)
  @JoinColumn({ name: "courseId" })
  course: Course
}
