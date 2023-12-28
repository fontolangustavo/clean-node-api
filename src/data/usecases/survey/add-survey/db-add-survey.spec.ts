import { DbAddSurvey } from './db-add-survey'
import { AddSurveyParams, AddSurveyRepository } from './db-add-survey.protocols'
import MockDate from 'mockdate'

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  created_at: new Date(),
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyParams): Promise<void> {

    }
  }

  return new AddSurveyRepositoryStub()
}

type SutTypes = {
  sut: DbAddSurvey,
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
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

    const survey = makeFakeSurveyData()
    await sut.add(survey)

    expect(addSpy).toHaveBeenCalledWith(survey)
  });

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const survey = makeFakeSurveyData()
    const promise = sut.add(survey)

    await expect(promise).rejects.toThrow()
  });
});