
import { Validation } from "../../../presentation/protocols/validation";
import { RequireFieldValidation, ValidationComposite, EmailValidation } from "../../../presentation/helpers/validators";
import { EmailValidatorAdapter } from "../../../utils/email-validator";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequireFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
