import * as dotenv from "dotenv";
import * as fs from "fs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const envFilePath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

    try {
      this.envConfig = dotenv.parse(fs.readFileSync(envFilePath));
    } catch (error) {
      console.warn(
        `Warning: ${envFilePath} file not found. Using process.env variables.`
      );
      this.envConfig = {};
    }
  }

  get(key: string): string {
    return this.envConfig[key] || process.env[key];
  }

  // Database configuration
  get dbHost(): string {
    return this.get("DATABASE_HOST") || "localhost";
  }

  get dbPort(): number {
    return parseInt(this.get("DATABASE_PORT") || "5433", 10);
  }

  get dbUsername(): string {
    return this.get("DATABASE_USER") || "postgres";
  }

  get dbPassword(): string {
    return this.get("DATABASE_PASSWORD") || "postgres";
  }

  get dbName(): string {
    return this.get("DATABASE_NAME") || "coursera";
  }

  get nodeEnv(): string {
    return this.get("NODE_ENV") || "development";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }
}
