import { forbidden, ok } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyByIdStub: LoadSurveyById) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params

    const survey = await this.loadSurveyByIdStub.loadById(surveyId)

    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }

    return ok(survey)
  }
}