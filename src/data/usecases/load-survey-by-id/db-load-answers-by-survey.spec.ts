import { LoadAnswersBySurveyRepository } from './db-load-answers-by-survey.protocols'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'
import { mockFakeSurvey } from '@/domain/test'
import { mockLoadAnswersBySurveyRepository } from '@/data/test'

type SutTypes = {
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
  sut: DbLoadAnswersBySurvey
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)

  return {
    sut,
    loadAnswersBySurveyRepositoryStub
  }
}

describe('DbLoadAnswersBySurvey', () => {
  test('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')

    await sut.loadAnswers('any_id')

    expect(loadSpy).toHaveBeenCalled()
  });

  test('should return answers on success', async () => {
    const { sut } = makeSut()

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual(mockFakeSurvey().answers.map(item => item.answer))
  });

  test('should return empty array if LoadAnswersBySurveyRepository returns []', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()

    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockReturnValueOnce(Promise.resolve([]))
    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([])
  });

  test('should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()

    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  });
});