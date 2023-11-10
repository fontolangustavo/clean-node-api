import { RequireFieldValidation } from "../../../presentation/helpers/validators/required-field-validation";
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite";
import { Validation } from "../../../presentation/helpers/validators/validation";
import { CompareFieldValidation } from "../../../presentation/helpers/validators/compare-fields-validation";
import { EmailValidator } from "../../../presentation/protocols/email-validator";
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation";
import { makeLoginValidation } from "./login-validation";


jest.mock('../../../presentation/helpers/validators/validation-composite')

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