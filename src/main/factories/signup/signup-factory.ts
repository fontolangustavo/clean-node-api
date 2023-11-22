import env from "../../../main/config/env";
import { Controller } from "../../../presentation/protocols";
import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRespository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter";
import { LogControllerDecorator } from "../../decorations/log-controller-decorator";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  const jwtAdapter = new JwtAdapter(env.jwtSecret)

  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )


  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation(), dbAuthentication)
  const logErrorRepository = new LogMongoRespository()

  return new LogControllerDecorator(signUpController, logErrorRepository)
}
