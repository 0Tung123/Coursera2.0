import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { HttpExceptionFilter } from "./common/filters/http-exception.filter"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global settings
  app.enableCors() // Enable CORS for frontend
  app.setGlobalPrefix("api") // Add global API prefix
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle("Coursera API")
    .setDescription("The Coursera API documentation")
    .setVersion("1.0")
    .addTag("users")
    .addTag("courses")
    .addTag("auth")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth", // This is a key to be used in @ApiBearerAuth() decorator
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  await app.listen(3001)
  console.log(`Application is running on: ${await app.getUrl()}`)
  console.log(
    `Swagger documentation available at: ${await app.getUrl()}/api/docs`,
  )
}
bootstrap()
