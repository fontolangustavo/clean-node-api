import { adapterResolver } from "@/main/adapters"
import { makeSignUpController, makeLoginController } from "@/main/factories"

export default {
  Query: {
    login: async (parent: any, args: any) => adapterResolver(makeLoginController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => adapterResolver(makeSignUpController(), args)
  }
}