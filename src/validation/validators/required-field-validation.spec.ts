import { MissingParamError } from "../../presentation/errors";
import { RequireFieldValidation } from "./required-field-validation";

const makeSut = (): RequireFieldValidation => {
  return new RequireFieldValidation('field')
}

describe('Require field validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      name: 'any_value'
    })

    expect(error).toEqual(new MissingParamError('field'))
  });

  test('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value'
    })

    expect(error).toBeFalsy()

  });
});