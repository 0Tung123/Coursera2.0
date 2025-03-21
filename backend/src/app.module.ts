import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { CoursesModule } from "./courses/courses.module"
import { DatabaseModule } from "./database/database.module"
import { ConfigModule } from "./config/config.module"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { MailModule } from "./mail/mail.module"

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
