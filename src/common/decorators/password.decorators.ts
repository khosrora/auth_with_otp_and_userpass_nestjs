import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function ConfirmedPassword(
  property: string,
  validationOption?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOption,
      constraints: [property],
      validator: ConfirmPasswordConstraint,
    });
  };
}

@ValidatorConstraint({
  name: "ConfirmPassword",
  async: false,
})
export class ConfirmPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments) {
    const { object, constraints } = args;
    const [property] = constraints;
    const relatedValue = object[property];
    return value === relatedValue;
  }
  defaultMessage?(args?: ValidationArguments): string {
    return "کلمه عبور و تایید کلمه عبور یکسان نمی باشد";
  }
}
