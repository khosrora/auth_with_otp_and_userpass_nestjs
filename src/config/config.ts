import { registerAs } from "@nestjs/config";

export enum configKeys {
  APP = "APP",
  DATABASE = "DB",
  JWT = "JWT",
}

const AppConfig = registerAs(configKeys.APP, () => ({
  port: "3000",
}));

const DbConfig = registerAs(configKeys.DATABASE, () => ({
  port: "5432",
  host: "localhost",
  username: "jobber",
  password: "api",
  database: "jobber_reviews",
}));

const JwtConfig = registerAs(configKeys.JWT, () => ({
  accessTokenSecret: "780481519b8a7c4ace3f796c94736cdeb13754c0",
  refreshTokenSecret: "7b390758160d7f2a1a416b2a5a856a8e7ba89616",
}));

export const Configuration = [AppConfig, DbConfig, JwtConfig];
