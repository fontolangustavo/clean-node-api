import MockDate from 'mockdate'

import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id.protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'

const makeFakeSurvey = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_questions',
    created_at: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
    ],
  }
)

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async load(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  sut: DbLoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
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
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'load')

    await sut.load('any_id')

    expect(loadSpy).toHaveBeenCalled()
  });

  test('should return a survey on success', async () => {
    const { sut } = makeSut()

    const survey = await sut.load('any_id')

    expect(survey).toEqual(makeFakeSurvey())
  });

  test('should throw if LoadSurveysRepositoryStub throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyByIdRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.load('any_id')

    await expect(promise).rejects.toThrow()
  });
});