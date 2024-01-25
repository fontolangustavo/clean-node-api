import { SurveyModel } from "@/domain/models/survey";

export interface LoadSurveysRepository {
  load(accountId: string): Promise<LoadSurveysRepository.Result>
}

export namespace LoadSurveysRepository {
  export type Result = SurveyModel[]
}
