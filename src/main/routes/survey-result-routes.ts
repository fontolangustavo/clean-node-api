import { Router } from "express";
import { adapterRoute } from "@/main/adapters/express-route-adapter";
import { makeSaveSurveyResultController } from "@/main/factories/controllers/survey-result/save-survey-result/save-surveys-controller-factory";
import { makeLoadSurveyResultController } from "../factories/controllers/survey-result/load-survey-result/load-surveys-controller-factory";
import { auth } from "../middlewares";

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adapterRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adapterRoute(makeLoadSurveyResultController()))
}