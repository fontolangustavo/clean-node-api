import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult
} from "./save-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.account
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (survey) {
        const answers = survey.answers.map(item => item.answer)

        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }

      await this.saveSurveyResult.save({
        accountId: id,
        surveyId,
        answer,
        created_at: new Date()
      })

      return ok(survey)
    } catch (error) {
      return serverError(error)
    }
  }
}