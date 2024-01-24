import {
  Controller,
  HttpResponse,
  CheckSurveyById,
  LoadSurveyResult
} from "./load-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";
import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper";

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { id } = request.account
      const { surveyId } = request

      const exists = await this.checkSurveyById.checkById(surveyId)

      if (!exists) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyResult = await this.loadSurveyResult.load(surveyId, id)

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    account: AccountModel
  }

  type AccountModel = {
    id: string
  }
}
