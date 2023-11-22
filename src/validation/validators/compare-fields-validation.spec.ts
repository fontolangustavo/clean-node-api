import { InvalidParamError } from "../../presentation/errors";
import { CompareFieldValidation } from "./compare-fields-validation";

const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation('field', 'fieldToCompare')
}

describe('Compare fields validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'invalid_value'
    })

    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  });

  test('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })

    expect(error).toBeFalsy()

  });
});