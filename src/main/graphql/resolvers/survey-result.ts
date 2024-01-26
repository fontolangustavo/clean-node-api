import { adapterResolver } from "@/main/adapters"
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from "@/main/factories"

export default {
  Query: {
    surveyResult: async (parent: any, args: any, context: any) => adapterResolver(makeLoadSurveyResultController(), args, context)
  },
  Mutation: {
    saveSurveyResult: async (parent: any, args: any, context: any) => adapterResolver(makeSaveSurveyResultController(), args, context)
  },
}