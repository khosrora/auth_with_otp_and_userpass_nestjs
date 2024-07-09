import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { randomInt } from "crypto";
import { Repository } from "typeorm";
import { OtpEntity } from "../user/entities/otp.entity";
import { UserEntity } from "../user/entities/user.entity";
import { CheckOtpDto, SendOtpDto } from "./dto/auth.dto";
import { LoginDto, SignUpDto } from "./dto/basic.dto";
import { TTokensPayload } from "./types/payload";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async send_otp_service(otpDto: SendOtpDto) {
    const { mobile } = otpDto;
    let user = await this.userRepository.findOneBy({ mobile });
    if (!user) {
      user = this.userRepository.create({
        mobile,
      });
      user = await this.userRepository.save(user);
    }
    await this.createOtpForUser(user);
    return {
      message: "کد ورود ارسال شد",
    };
  }

  async createOtpForUser(user: UserEntity) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId: user.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("کد ورود منقضی شد");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expires_in: expiresIn,
        userId: user.id,
      });
      await this.otpRepository.save(otp);
      user.otpId = otp.id;
    }
    otp = await this.otpRepository.save(otp);
    user.otpId = otp.id;
    await this.userRepository.save(user);
  }

  async check_otp(checkDto: CheckOtpDto) {
    const { mobile, code } = checkDto;
    const user = await this.userRepository.findOne({
      where: { mobile },
      relations: { otp: true },
    });

    const now = new Date();
    if (!user || !user?.otp)
      throw new UnauthorizedException("کاربری با این اطلاعات ثبت نشده است");

    const otp = user?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException("کد یک بار مصرف اشتباه وارد شده است");

    if (otp.expires_in < now)
      throw new UnauthorizedException("کد یک بار مصرف منقضی شده است");

    if (!user.mobile_verify) {
      await this.userRepository.update(
        {
          id: user.id,
        },
        {
          mobile_verify: true,
        }
      );
    }
    const { access_token, refresh_token } = this.createMakeTokenUser({
      id: user.id,
      mobile,
    });
    return { access_token, refresh_token, message: "کاربر با موفقیت وارد شد" };
  }

  createMakeTokenUser(payload: TTokensPayload) {
    const { id, mobile }: TTokensPayload = payload;
    const access_token = this.jwtService.sign(
      {
        id: id,
        mobile: mobile,
      },
      {
        secret: this.configService.get("JWT.accessTokenSecret"),
        expiresIn: "30d",
      }
    );
    const refresh_token = this.jwtService.sign(
      {
        id: id,
        mobile: mobile,
      },
      {
        secret: this.configService.get("JWT.refreshTokenSecret"),
        expiresIn: "1y",
      }
    );

    return { access_token, refresh_token };
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TTokensPayload>(token, {
        secret: this.configService.get("JWT.accessTokenSecret"),
      });
      if (typeof payload === "object" && payload.id) {
        const user = await this.userRepository.findOneBy({ id: payload.id });
        if (!user) throw new UnauthorizedException("login on your account");
        return user;
      } else {
        throw new UnauthorizedException("login on your account");
      }
    } catch (error) {
      throw new UnauthorizedException("login on your account");
    }
  }

  async sign_up(signUpDto: SignUpDto) {
    const { firstName, lastName, email, mobile, password } = signUpDto;
    await this.checkEmail(email);
    await this.checkMobile(mobile);
    let hashedPassword = this.hashedPassword(password);
    const user = this.userRepository.create({
      firstName,
      lastName,
      mobile,
      email,
      password: hashedPassword,
      mobile_verify: false,
    });
    await this.userRepository.save(user);
    return {
      message: "ثبت نام با موفقیت به اتمام رسید",
    };
  }

  async log_in(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new UnauthorizedException("کاربری با این مشخصات وجود ندارد");
    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException("نام کاربری یا کلمه عبور اشتباه است");
    }
    const { access_token, refresh_token } = this.createMakeTokenUser({
      id: user.id,
      mobile: user.mobile,
    });
    return { access_token, refresh_token, message: "کاربر با موفقیت وارد شد" };
  }

  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new ConflictException("پست الکترونیک قبلا ثبت شده است");
  }
  async checkMobile(mobile: string) {
    const user = await this.userRepository.findOneBy({ mobile });
    if (user) throw new ConflictException("شماره تماس قبلا ثبت شده است");
  }

  hashedPassword(password: string) {
    const salt = genSaltSync(10);
    let hashedPassword = hashSync(password, salt);
    return hashedPassword;
  }
}
