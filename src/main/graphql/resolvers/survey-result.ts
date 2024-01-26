import { adapterResolver } from "@/main/adapters"
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from "@/main/factories"

export default {
  Query: {
    surveyResult: async (parent: any, args: any) => adapterResolver(makeLoadSurveyResultController(), args)
  },
  Mutation: {
    saveSurveyResult: async (parent: any, args: any) => adapterResolver(makeSaveSurveyResultController(), args)
  },
}