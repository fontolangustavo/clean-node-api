import MockDate from 'mockdate'

import { DbLoadSurveyResult } from "./db-load-survey-result";
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepositoryStub } from "@/data/test";
import { mockFakeSurveyResult } from "@/domain/test";
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from './db-load-survey-result.protocols'


type SutType = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutType => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepositoryStub()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

let surveyId: string
let accountId: string

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    surveyId = 'any_survey_id'
    accountId = 'any_account_id'

    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyResultRepository with correct values', async () => {

    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    await sut.load(surveyId, accountId)

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyId, accountId)
  });

  test('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.load(surveyId, accountId)

    await expect(promise).rejects.toThrow()
  });

  test('should return surveyResultModel on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.load(surveyId, accountId)

    expect(surveyResult).toEqual(mockFakeSurveyResult())
  });

  test('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))

    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.load(surveyId, accountId)

    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId)
  });

  test('should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))

    const surveyResult = await sut.load(surveyId, accountId)

    expect(surveyResult).toEqual(mockFakeSurveyResult())
  });
});