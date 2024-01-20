import MockDate from 'mockdate'
import { AddSurvey, HttpRequest, Validation } from "./add-survey-controller-protocols";
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { mockAddSurvey, mockValidation } from "@/presentation/test";

const makeFakeQuest = (): AddSurveyController.Request => ({
  question: 'any_questions',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
  ],
})

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = makeFakeQuest()

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request)
  });

  test('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeQuest())

    expect(httpResponse).toEqual(badRequest(new Error()))
  });

  test('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()

    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const request = makeFakeQuest()

    await sut.handle(request)

    expect(addSpy).toHaveBeenCalledWith({
      ...request,
      created_at: new Date()
    })
  });

  test('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()

    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const httpResponse = await sut.handle(makeFakeQuest())
    expect(httpResponse).toEqual(serverError(new Error()))
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeQuest())

    expect(httpResponse).toEqual(noContent())
  });
});