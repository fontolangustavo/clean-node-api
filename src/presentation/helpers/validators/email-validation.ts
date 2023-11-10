import { InvalidParamError } from "../../../presentation/errors";
import { EmailValidator } from "../../protocols";
import { Validation } from "../../protocols/validation";

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor(fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate(input: any): Error {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
  }
}