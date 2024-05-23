import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
}
