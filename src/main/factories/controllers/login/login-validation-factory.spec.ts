import { Validation } from "../../../../presentation/protocols/validation";
import { EmailValidator } from "../../../../presentation/protocols/email-validator";
import { makeLoginValidation } from "./login-validation-factory";
import { RequireFieldValidation, EmailValidation, ValidationComposite } from "../../../../presentation/helpers/validators";

jest.mock('../../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidator implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidator()
}

describe('LoginValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()

    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequireFieldValidation(field))
    }

    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });

});