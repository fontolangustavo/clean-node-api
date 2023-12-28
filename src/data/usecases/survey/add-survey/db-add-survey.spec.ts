import MockDate from 'mockdate'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from './db-add-survey.protocols'
import { mockAddSurveyRepository } from '@/data/test'
import { mockFakeSurveyParams } from '@/domain/test'

type SutTypes = {
  sut: DbAddSurvey,
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    const survey = mockFakeSurveyParams()
    await sut.add(survey)

    expect(addSpy).toHaveBeenCalledWith(survey)
  });

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const survey = mockFakeSurveyParams()
    const promise = sut.add(survey)

    await expect(promise).rejects.toThrow()
  });
});