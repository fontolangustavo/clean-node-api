import MockDate from 'mockdate'

import { LoadSurveysRepository } from './db-load-surveys.protocols'
import { DbLoadSurveys } from './db-load-surveys'
import { mockLoadSurveysRepository } from '@/data/test'
import { mockFakeSurveys } from '@/domain/test'


type SutTypes = {
  loadSurveysRepositoryStub: LoadSurveysRepository
  sut: DbLoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'load')

    await sut.load('any_id')

    expect(loadSpy).toHaveBeenCalledWith('any_id')
  });

  test('should return a list of Surveys on success', async () => {
    const { sut } = makeSut()

    const surveys = await sut.load('any_id')

    expect(surveys).toEqual(mockFakeSurveys())
  });

  test('should throw if LoadSurveysRepositoryStub throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()

    jest.spyOn(loadSurveysRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.load('any_id')

    await expect(promise).rejects.toThrow()
  });
});