import env from "../../../main/config/env";
import { LogControllerDecorator } from "../../../main/decorations/log-controller-decorator";
import { Controller } from "../../../presentation/protocols";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { LogMongoRespository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter";
import { makeLoginValidation } from "./login-validation-factory";

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)

  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )

  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  const logMongoRespository = new LogMongoRespository()

  return new LogControllerDecorator(loginController, logMongoRespository)
}
