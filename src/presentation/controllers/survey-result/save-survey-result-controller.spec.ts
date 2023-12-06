
import { HttpRequest, LoadSurveyById, SurveyModel } from "./save-survey-result-controller-protocols";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper";
import { InvalidParamError } from "@/presentation/errors";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  }
})


const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_questions',
  created_at: new Date(),
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
  ],
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey())
    }
  }

  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()

  const sut = new SaveSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResultController', () => {
  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(makeFakeRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  });

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  });

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  });

  test('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  });
});
