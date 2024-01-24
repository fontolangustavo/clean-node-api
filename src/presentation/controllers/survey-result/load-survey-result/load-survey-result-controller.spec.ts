import MockDate from 'mockdate'

import { mockCheckSurveyById, mockLoadSurveyResult } from "@/presentation/test";
import { LoadSurveyResultController } from "./load-survey-result-controller";
import { CheckSurveyById, LoadSurveyResult } from "./load-survey-result-controller-protocols";
import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import { mockFakeSurveyResult } from "@/domain/test";


const makeFakeRequest = (): LoadSurveyResultController.Request => ({
  account: {
    id: 'any_account_id'
  },
  surveyId: 'any_id'
})

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdStub = mockCheckSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(checkSurveyByIdStub, loadSurveyResultStub)

  return {
    sut,
    checkSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call CheckSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()

    const checkSurveyByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')

    await sut.handle(makeFakeRequest())

    expect(checkSurveyByIdSpy).toHaveBeenCalledWith('any_id')
  });

  test('should return 403 if CheckSurveyById returns null', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()

    jest.spyOn(checkSurveyByIdStub, 'checkById').mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  });

  test('should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()

    jest.spyOn(checkSurveyByIdStub, 'checkById').mockImplementation(() => { throw new Error() })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  });

  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()

    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');

    const result = await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_id', 'any_account_id')
  });
});