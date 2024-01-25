import { SurveyResultModel } from "@/domain//models/survey-result"

export interface SaveSurveyResult {
  save: (data: SaveSurveyResult.Params) => Promise<SurveyResultModel>
}

export namespace SaveSurveyResult {
  export type Params = {
    surveyId: string
    accountId: string
    answer: string
    created_at: Date
  }

  export type Result = SurveyResultModel
}
