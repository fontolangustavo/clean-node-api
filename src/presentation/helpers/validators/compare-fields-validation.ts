import { InvalidParamError } from "../../../presentation/errors";
import { Validation } from "../../protocols/validation";

export class CompareFieldValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToCompareName: string

  constructor(fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}