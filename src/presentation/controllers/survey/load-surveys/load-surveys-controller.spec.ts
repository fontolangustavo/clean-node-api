import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

const makeFakeSurveys = (): SurveyModel[] => {
  return [
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
    },
    {
      id: 'any_id',
      question: 'other_questions',
      created_at: new Date(),
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer'
        },
      ],
    }
  ]
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys())
    }
  }

  return new LoadSurveysStub()
}

type SutTypes = {
  loadSurveysStub: LoadSurveys,
  sut: LoadSurveysController
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut, loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveys ', async () => {
    const { sut, loadSurveysStub } = makeSut()

    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    sut.handle({})

    expect(loadSpy).toHaveBeenCalled()
  });

  test('should return 200 on success', async () => {
    const { sut, } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  });

  test('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()

    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(noContent())
  });

  test('should return 500 if AddSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()

    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))

    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  });
});