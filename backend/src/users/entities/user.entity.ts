import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm"
import * as bcrypt from "bcrypt"
import { ApiProperty } from "@nestjs/swagger"
import { UserCourse } from "./user-course.entity"

export enum UserRole {
  USER = "user",
  INSTRUCTOR = "instructor",
  ADMIN = "admin",
}

@Entity()
export class User {
  @ApiProperty({ description: "The unique identifier of the user" })
  @PrimaryGeneratedColumn("uuid")
  user_id: string

  @ApiProperty({
    description: "The email address of the user",
    example: "user@example.com",
  })
  @Column({ unique: true })
  email: string

  @ApiProperty({
    description: "The hashed password of the user",
    example: "password123",
  })
  @Column()
  password: string

  @ApiProperty({ description: "The first name of the user", example: "John" })
  @Column()
  firstName: string

  @ApiProperty({ description: "The last name of the user", example: "Doe" })
  @Column()
  lastName: string

  @ApiProperty({
    description: "Password reset token",
    required: false,
  })
  @Column({ nullable: true })
  resetToken?: string

  @ApiProperty({
    description: "Password reset token expiration date",
    required: false,
  })
  @Column({ nullable: true })
  resetTokenExpires?: Date

  @ApiProperty({
    description: "The role of the user",
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole

  @ApiProperty({ description: "Whether the user is active", default: true })
  @Column({ default: true })
  isActive: boolean

  @ApiProperty({
    description: "Whether the user's email is verified",
    default: false,
  })
  @Column({ default: false })
  isEmailVerified: boolean

  @ApiProperty({ description: "The token used for email verification" })
  @Column({ nullable: true })
  verificationToken: string

  @ApiProperty({ description: "The date when the user was created" })
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }

  @OneToMany(() => UserCourse, (userCourse) => userCourse.user)
  courses: UserCourse[]
}
