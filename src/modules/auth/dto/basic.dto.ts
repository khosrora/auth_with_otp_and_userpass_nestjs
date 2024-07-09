import { IsEmail, IsMobilePhone, IsString, Length } from "class-validator";
import { ConfirmedPassword } from "src/common/decorators/password.decorators";

export class SignUpDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsMobilePhone("fa-IR", {}, { message: "شماره تماس اشتباه وارد شده است" })
  mobile: string;
  @IsString()
  @Length(6, 20, { message: "کلمه عبور بیشتر یا کمتر از حد مجاز است" })
  password: string;
  @IsString()
  @ConfirmedPassword  ("password")
  confirm_password: string;
  @IsString()
  @IsEmail({}, { message: "پست الکترونیک صحیح نمی باشد" })
  email: string;
}

export class LoginDto {
  @IsString()
  @IsEmail({}, { message: "پست الکترونیک صحیح نمی باشد" })
  email: string;
  @IsString()
  @Length(6, 20, { message: "کلمه عبور بیشتر یا کمتر از حد مجاز است" })
  password: string;
}
