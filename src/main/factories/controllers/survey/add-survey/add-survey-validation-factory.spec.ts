import { Validation } from "../../../../../presentation/protocols/validation";
import { makeAddSurveyValidation } from "./add-survey-validation-factory";
import { RequireFieldValidation, ValidationComposite } from "../../../../../validation/validators";

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()

    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequireFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });

});