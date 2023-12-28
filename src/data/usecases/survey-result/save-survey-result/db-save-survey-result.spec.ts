import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultParams } from './db-save-survey-result.protocols'
import { SurveyResultModel } from '@/domain/models/survey-result'
import MockDate from 'mockdate'

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  created_at: new Date()
})

const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  created_at: new Date()
})

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResult())
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult,
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
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

    const surveyResultData = makeFakeSurveyResultData()

    await sut.save(surveyResultData)

    expect(addSpy).toHaveBeenCalledWith(surveyResultData)
  });


  test('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))

    const survey = makeFakeSurveyResultData()
    const promise = sut.save(survey)

    await expect(promise).rejects.toThrow()
  });

  test('should return SurveyResult on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.save(makeFakeSurveyResultData())

    expect(surveyResult).toEqual(makeFakeSurveyResult())
  });
});