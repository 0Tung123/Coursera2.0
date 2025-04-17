import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateCourseDto {
  @ApiProperty({
    example: "Introduction to Programming",
    description: "Course title",
  })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({
    example: "Learn basic programming concepts",
    description: "Course description",
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    example: "optional_field_value",
    description: "Optional field",
    required: false,
  })
  @IsOptional()
  @IsString()
  instructor?: string

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number

  @IsOptional()
  @IsString()
  Course_id?: string
}
