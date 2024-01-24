import MockDate from 'mockdate'

import { forbidden, serverError } from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";
import {
  LoadAnswersBySurvey,
  SaveSurveyResult,
} from "./save-survey-result-controller-protocols";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import { mockLoadAnswersBySurvey, mockSaveSurveyResult } from '@/presentation/test';

const makeFakeRequest = (): SaveSurveyResultController.Request => ({

  surveyId: 'any_survey_id',
  answer: 'any_answer',
  account: {
    id: 'any_account_id'
  }
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveyStub: LoadAnswersBySurvey
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyStub = mockLoadAnswersBySurvey()
  const saveSurveyResultStub = mockSaveSurveyResult()

  const sut = new SaveSurveyResultController(loadAnswersBySurveyStub, saveSurveyResultStub)

  return {
    sut,
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers')

    await sut.handle(makeFakeRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  });

  test('should return 403 if LoadAnswersBySurvey returns null', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()

    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockReturnValueOnce(Promise.resolve([]))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  });

  test('should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()

    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockReturnValueOnce(Promise.reject(new Error()))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  });

  test('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      surveyId: 'any_id',
      answer: 'wrong_answer',
      account: {
        id: 'any_id'
      }
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  });

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()

    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

    await sut.handle(makeFakeRequest())

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      created_at: new Date()
    })
  });
});
