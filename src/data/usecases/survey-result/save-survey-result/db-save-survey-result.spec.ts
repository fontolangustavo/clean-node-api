import MockDate from 'mockdate'

import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockFakeSurveyResult, mockFakeSurveyResultData } from '@/domain/test'
import { mockSaveSurveyResultRepository } from '@/data/test'

type SutTypes = {
  sut: DbSaveSurveyResult,
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    const surveyResultData = mockFakeSurveyResultData()

    await sut.save(surveyResultData)

    expect(addSpy).toHaveBeenCalledWith(surveyResultData)
  });

  test('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))

    const survey = mockFakeSurveyResultData()
    const promise = sut.save(survey)

    await expect(promise).rejects.toThrow()
  });

  test('should return SurveyResult on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.save(mockFakeSurveyResultData())

    expect(surveyResult).toEqual(mockFakeSurveyResult())
  });
});