import { Router } from "express";
import { adapterRoute } from "@/main/adapters/express-route-adapter";
import { makeSaveSurveyResultController } from "@/main/factories/controllers/survey-result/save-survey-result/load-surveys-controller-factory";
import { auth } from "../middlewares";

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adapterRoute(makeSaveSurveyResultController()))
}