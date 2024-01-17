type SurveyAnswerModel = {
  image?: string
  answer: string
  count: number
  percent: number
  isCurrentAccountAnswer: boolean
}

export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: SurveyAnswerModel[],
  created_at: Date
}


