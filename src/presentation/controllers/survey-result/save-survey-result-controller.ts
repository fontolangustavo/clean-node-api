import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyByIdStub: LoadSurveyById) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body

      const survey = await this.loadSurveyByIdStub.loadById(surveyId)

      if (survey) {
        const answers = survey.answers.map(item => item.answer)

        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }

      } else {
        return forbidden(new InvalidParamError('surveyId'))

      }

      return ok(survey)
    } catch (error) {
      return serverError(error)
    }
  }
}