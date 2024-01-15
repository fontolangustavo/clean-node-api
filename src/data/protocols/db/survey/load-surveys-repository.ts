import { SurveyModel } from "@/domain/models/survey";

export interface LoadSurveysRepository {
  load(accountId: string): Promise<SurveyModel[]>
}