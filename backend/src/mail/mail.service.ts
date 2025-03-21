import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "src/config/config.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async sendVerificationEmail(user: User, token: string): Promise<void> {
    const url = `${this.configService.get("APP_URL")}/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to Coursera 2.0! Confirm your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4285f4;">Welcome to Coursera 2.0!</h2>
          <p>Hi ${user.firstName},</p>
          <p>Thank you for registering with Coursera 2.0. To complete your registration, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can also click on the link below or copy and paste it into your browser:</p>
          <p><a href="${url}">${url}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account, no further action is required.</p>
          <p>Best regards,<br>The Coursera 2.0 Team</p>
        </div>
      `,
    });
  }
}
