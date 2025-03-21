import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UsersService } from "../users/users.service"
import { LoginDto } from "../users/dto/login.dto"
import { User } from "../users/entities/user.entity"
import { AuthUser } from "./interfaces/user.interface"
import { JwtPayload } from "./interfaces/jwt-payload.interface"
import { MailService } from "../mail/mail.service"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.usersService.findByEmail(email)
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto
    const user = await this.validateUser(email, password)

    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException("Email not verified")
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    }

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }
  }

  async getProfile(userId: string): Promise<User> {
    return this.usersService.findOne(userId)
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    // Create user with verification token
    const verificationToken = uuidv4()
    const user = await this.usersService.create({
      ...createUserDto,
      verificationToken,
    })

    // Send verification email
    await this.mailService.sendVerificationEmail(user, verificationToken)

    return user
  }

  async verifyEmail(token: string): Promise<User> {
    // Find user by verification token
    const user = await this.usersService.findByVerificationToken(token)

    if (!user) {
      throw new NotFoundException("Verification token not found or expired")
    }

    // Update user to mark email as verified and clear token
    user.isEmailVerified = true
    user.verificationToken = null

    return this.usersService.save(user)
  }
}
