import { PartialType } from "@nestjs/swagger"
import { CreateCourseDto } from "./create-course.dto"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsNumber, Min, Max } from "class-validator"

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @ApiProperty({
    example: "Updated Course Title",
    description: "Course title",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({
    example: "Updated course description",
    description: "Course description",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    example: "Updated instructor name",
    description: "Course instructor",
    required: false,
  })
  @IsOptional()
  @IsString()
  instructor?: string

  @ApiProperty({
    example: "https://example.com/updated-image.jpg",
    description: "URL to course image",
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string

  @ApiProperty({
    example: 4.5,
    description: "Course rating (0-5)",
    required: false,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number
}
