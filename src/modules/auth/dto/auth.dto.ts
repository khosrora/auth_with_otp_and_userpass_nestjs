import { IsMobilePhone, IsString, Length } from "class-validator";

export class SendOtpDto {
  @IsMobilePhone("fa-IR", {}, { message: "شماره تماس وارد شده صحیح نمی باشد" })
  mobile: string;
}

export class CheckOtpDto {
  @IsMobilePhone("fa-IR", {}, { message: "شماره تماس وارد شده صحیح نمی باشد" })
  mobile: string;

  @IsString()
  @Length(5, 5, { message: "Incorrect code" })
  code: string;
}
