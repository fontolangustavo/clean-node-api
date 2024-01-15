export type SurveyAnswerModel = {
  image?: string
  answer: string
}

export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  didAnswer?: boolean
  created_at: Date
}
