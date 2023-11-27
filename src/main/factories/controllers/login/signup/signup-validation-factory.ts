
import { CompareFieldValidation, ValidationComposite, EmailValidation, RequireFieldValidation } from "../../../../../validation/validators";
import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from "../../../../../infra/validators/email-validator";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequireFieldValidation(field))
  }

  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
