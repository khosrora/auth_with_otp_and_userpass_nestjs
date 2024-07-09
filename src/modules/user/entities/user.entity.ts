import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OtpEntity } from "./otp.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  mobile_verify: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  @JoinColumn({ name: "otpId" })
  otp: OtpEntity;
}
