import MockDate from 'mockdate'

import { CheckSurveyByIdRepository } from './db-check-survey-by-id.protocols'
import { DbCheckSurveyById } from './db-check-survey-by-id'
import { mockCheckSurveyByIdRepository } from '@/data/test'


type SutTypes = {
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
  sut: DbCheckSurveyById
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)

  return {
    sut,
    checkSurveyByIdRepositoryStub
  }
}

describe('DbCheckSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call CheckSurveyByIdRepository', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    const checkSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')

    await sut.checkById('any_id')

    expect(checkSpy).toHaveBeenCalled()
  });

  test('should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()

    const exists = await sut.checkById('any_id')

    expect(exists).toBeTruthy()
  });

  test('hould return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))

    const exists = await sut.checkById('any_id')

    expect(exists).toBeFalsy()
  });

  test('should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.checkById('any_id')

    await expect(promise).rejects.toThrow()
  });
});