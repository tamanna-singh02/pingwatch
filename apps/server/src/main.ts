import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({
    origin: config.get("WEB_ORIGIN", "http://localhost:5173"),
    credentials: true,
  });
  app.setGlobalPrefix("api");

  const port = config.get("PORT", 3001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`PingWatch API listening on http://localhost:${port}/api`);
}

bootstrap();
