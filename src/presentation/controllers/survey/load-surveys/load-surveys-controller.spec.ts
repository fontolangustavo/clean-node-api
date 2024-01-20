import MockDate from 'mockdate'
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys } from './load-surveys-controller-protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveys } from '@/presentation/test'
import { mockFakeSurveys } from '@/domain/test'

const mockRequest = (): LoadSurveysController.Request => (
  { account: { id: 'any_id' } }
)

type SutTypes = {
  loadSurveysStub: LoadSurveys,
  sut: LoadSurveysController
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
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

  test('should call LoadSurveys with correct values', async () => {
    const { sut, loadSurveysStub } = makeSut()

    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    const request = mockRequest()
    sut.handle(request)

    expect(loadSpy).toHaveBeenCalledWith(request.account.id)
  });

  test('should return 200 on success', async () => {
    const { sut, } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(ok(mockFakeSurveys()))
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