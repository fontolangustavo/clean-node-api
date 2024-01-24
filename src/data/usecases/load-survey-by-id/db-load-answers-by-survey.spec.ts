import { LoadSurveyByIdRepository } from './db-load-answers-by-survey.protocols'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'
import { mockFakeSurvey } from '@/domain/test'
import { mockLoadSurveyByIdRepository } from '@/data/test'

type SutTypes = {
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  sut: DbLoadAnswersBySurvey
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadAnswersBySurvey', () => {
  test('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.loadAnswers('any_id')

    expect(loadSpy).toHaveBeenCalled()
  });

  test('should return answers on success', async () => {
    const { sut } = makeSut()

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([
      mockFakeSurvey().answers[0].answer,
      mockFakeSurvey().answers[1].answer
    ])
  });

  test('should return empty array if LoadSurveysRepositoryStub returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([])
  });

  test('should throw if LoadSurveysRepositoryStub throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  });
});