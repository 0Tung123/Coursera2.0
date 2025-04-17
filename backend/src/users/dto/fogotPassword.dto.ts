import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from "class-validator"
import { UserRole } from "../entities/user.entity"
import { ApiProperty } from "@nestjs/swagger"

export class ForgotPasswordDto {
  @ApiProperty({
    description: "The email address of the user",
    example: "user@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: "The password of the user",
    example: "password123",
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({
    description: "The password of the user",
    example: "password123",
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  Repassword: string

  @ApiProperty({
    description: "The role of the user",
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiProperty({
    description: "The verification token for email verification",
    required: false,
  })
  @IsOptional()
  @IsString()
  verificationToken?: string
}
