import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CheckOtpDto, SendOtpDto } from "./dto/auth.dto";
import { LoginDto, SignUpDto } from "./dto/basic.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/send_otp")
  sendOtp(@Body() body: SendOtpDto) {
    return this.authService.send_otp_service(body);
  }

  @Post("/check_otp")
  checkOtp(@Body() body: CheckOtpDto) {
    return this.authService.check_otp(body);
  }

  @Post("/sign_up")
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.sign_up(signUpDto);
  }
 
  @Post("/sign_in")
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.log_in(loginDto);
  }
}
