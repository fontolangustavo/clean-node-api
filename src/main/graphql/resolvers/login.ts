import { adapterResolver } from "@/main/adapters"
import { makeLoginController } from "@/main/factories/controllers/login/login/login-controller-factory"

export default {
  Query: {
    login: async (parent: any, args: any) => adapterResolver(makeLoginController(), args)
  }
}