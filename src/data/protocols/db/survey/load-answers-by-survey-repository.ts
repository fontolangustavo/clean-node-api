export interface LoadAnswersBySurveyRepository {
  loadAnswers: (id: string) => Promise<LoadAnswersBySurveyRepository.Result | null>
}

export namespace LoadAnswersBySurveyRepository {
  export type Result = string[]
}
