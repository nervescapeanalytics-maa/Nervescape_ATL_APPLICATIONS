import { Request, Response, NextFunction } from 'express';

export function asyncH(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({ error: err.message || 'Internal server error' });
}

export function httpError(status: number, message: string) {
  const e: any = new Error(message);
  e.status = status;
  return e;
}
