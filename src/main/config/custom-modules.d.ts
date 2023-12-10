import { AccountModel } from "@/domain/models/account";

declare global {
  namespace Express {
    interface Request {
      account?: AccountModel
    }
  }
}