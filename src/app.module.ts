import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomConfigModule } from "src/modules/config/configs.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmDbConfig } from "./config/typeorm.config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
      inject: [TypeOrmDbConfig],
    }),
    UserModule,
    AuthModule,
    JwtModule
  ],
  controllers: [AppController],
  providers: [AppService, TypeOrmDbConfig],
})
export class AppModule {}
