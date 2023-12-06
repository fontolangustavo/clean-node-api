import { SurveyResultModel } from "@/domain//models/survey-result"

export type SaveSurveyResultModel = {
  surveyId: string
  accountId: string
  answer: string
  created_at: Date
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
