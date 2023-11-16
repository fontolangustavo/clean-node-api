import { RequireFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { ValidationComposite, CompareFieldValidation, EmailValidation } from "../../../presentation/helpers/validators";
import { makeSignUpValidation } from "./signup-validation-factory";
import { Validation } from "../../../presentation/protocols/validation";
import { EmailValidator } from "../../../presentation/protocols/email-validator";


jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidator implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidator()
}

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()

    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequireFieldValidation(field))
    }

    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });

});