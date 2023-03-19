import { Request, Response } from 'express';
import rateLimit, { Options as RateLimitOptions } from 'express-rate-limit';
import slowDown, { Options as SlowDownOptions } from 'express-slow-down';
import { NextApiRequest, NextApiResponse } from 'next';

type CustomMiddleware = (
  req: Request | NextApiRequest,
  res: Response | NextApiResponse,
  next: (result?: unknown) => void
) => void;

type CustomRateLimitMiddleware = (
  options?: RateLimitOptions
) => CustomMiddleware;

type CustomSlowDownMiddleware = (options?: SlowDownOptions) => CustomMiddleware;

export const applyMiddlewareCustom =
  (middleware: CustomMiddleware) =>
  (request: NextApiRequest, response: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(request, response, (result) =>
        result instanceof Error ? reject(result) : resolve(result)
      );
    });

const getIP = (request: Request): string =>
  request.ip ||
  (request.headers['x-forwarded-for'] as string) ||
  (request.headers['x-real-ip'] as string) ||
  request.connection.remoteAddress!;

interface RateLimitMiddlewareOptions {
  limit?: number;
  windowMs?: number;
  delayAfter?: number;
  delayMs?: number;
}

export const getRateLimitMiddlewares = ({
  limit = 10,
  windowMs = 60 * 1000,
  delayAfter = Math.round(10 / 2),
  delayMs = 500
}: RateLimitMiddlewareOptions = {}): [
  ReturnType<CustomSlowDownMiddleware>,
  ReturnType<CustomRateLimitMiddleware>
] => [
  slowDown({
    keyGenerator: getIP,
    windowMs,
    delayAfter,
    delayMs
  }) as CustomMiddleware,
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }) as CustomMiddleware
];

const middlewares = getRateLimitMiddlewares();

async function applyRateLimit(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  await Promise.all(
    middlewares
      .map(applyMiddlewareCustom)
      .map((middleware) => middleware(request, response))
  );
}

export default applyRateLimit;
