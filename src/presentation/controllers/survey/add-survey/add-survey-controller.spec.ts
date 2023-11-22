import { Controller, HttpRequest, HttpResponse, Validation } from "./add-survey-controller-protocols";
import { AddSurveyController } from './add-survey-controller'

const makeFakeQuest = (): HttpRequest => ({
  body: {
    question: 'any_questions',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
})

describe('AddSurvey Controller', () => {
  test('should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate(input: any): Error | null {
        return null
      }
    }

    const validationStub = new ValidationStub()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const sut = new AddSurveyController(validationStub)

    const httpRequest = makeFakeQuest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  });
});