import { noContent, ok, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpResponse, LoadSurveys } from "./load-surveys-controller-protocols";

export class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: LoadSurveys
  ) { }

  async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.account?.id)

      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    account?: AccountModel
  }
  type AccountModel = {
    id: string
  }
}
