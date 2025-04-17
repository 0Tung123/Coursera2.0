import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
  @ApiProperty({
    description: "The email address of the user",
    example: "harrybother33@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: "The password of the user",
    example: "123456",
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string
}
