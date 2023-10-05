import { NextFunction, Request, Response } from "express";

export const cors = (req: Request, res: Response, next: NextFunction) => {
  res.set('access-control-allow-origin', '*')
  next()
}
