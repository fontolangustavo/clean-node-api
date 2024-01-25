import type { SurveyModel } from '../../models/survey'

export interface LoadSurveys {
  load: (accountId: string) => Promise<LoadSurveys.Result | null>
}

export namespace LoadSurveys {
  export type Result = SurveyModel[]
}
