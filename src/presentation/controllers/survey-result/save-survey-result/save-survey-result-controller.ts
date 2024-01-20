import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper";
import {
  Controller,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult
} from "./save-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";
import { AccountModel } from "@/domain/models/account";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle(request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { id } = request.account
      const { surveyId, answer } = request

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

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    account?: AccountModel
  }

  type AccountModel = {
    id: string
  }
}
