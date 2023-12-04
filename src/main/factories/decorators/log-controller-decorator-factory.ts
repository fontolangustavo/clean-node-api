import { LogControllerDecorator } from "../../decorations/log-controller-decorator";
import { Controller } from "@/presentation/protocols";
import { LogMongoRespository } from "@/infra/db/mongodb/log/log-mongo-repository";

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRespository = new LogMongoRespository()

  return new LogControllerDecorator(controller, logMongoRespository)
}
