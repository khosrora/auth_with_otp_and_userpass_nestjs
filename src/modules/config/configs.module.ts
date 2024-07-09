import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Configuration } from "src/config/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configuration,
      isGlobal: true,
    }),
  ],
})
export class CustomConfigModule {}
