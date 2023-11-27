import { makeSignUpValidation } from './signup-validation-factory'
import { RequireFieldValidation, EmailValidation, CompareFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { Validation } from '../../../../../presentation/protocols'

jest.mock('../../../../../validation/validators/validation-composite')

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