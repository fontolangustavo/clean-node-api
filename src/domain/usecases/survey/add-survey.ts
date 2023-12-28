import { SurveyAnswerModel } from "../../models/survey"

export type AddSurveyParams = {
  question: string
  answers: SurveyAnswerModel[],
  created_at: Date
}


export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
