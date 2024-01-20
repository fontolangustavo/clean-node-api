import { SurveyAnswerModel } from "../../models/survey"

export interface AddSurvey {
  add: (data: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
  export type Params = {
    question: string
    answers: SurveyAnswerModel[],
    created_at: Date
    didAnswer?: boolean
  }
}
