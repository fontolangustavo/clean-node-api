import { mockLoadSurveyById } from "@/presentation/test";
import { LoadSurveyResultController } from "./load-survey-result-controller";
import { HttpRequest, LoadSurveyById } from "./load-survey-result-controller-protocols";


const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  },
  // body: {
  //   answer: 'any_answer'
  // },
  // account: {
  //   id: 'any_account_id'
  // }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResult Controller', () => {
  test('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(makeFakeRequest())

    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_id')
  });
});