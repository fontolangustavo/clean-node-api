import MockDate from 'mockdate'

import { LoadSurveyByIdRepository } from './db-load-survey-by-id.protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { mockFakeSurvey } from '@/domain/test'
import { mockLoadSurveyByIdRepository } from '@/data/test'


type SutTypes = {
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  sut: DbLoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.loadById('any_id')

    expect(loadSpy).toHaveBeenCalled()
  });

  test('should return a survey on success', async () => {
    const { sut } = makeSut()

    const survey = await sut.loadById('any_id')

    expect(survey).toEqual(mockFakeSurvey())
  });

  test('should throw if LoadSurveysRepositoryStub throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrow()
  });
});