import { createHash, timingSafeEqual } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

const REALM = 'Basic realm="Raizes API docs"';

function sameValue(left: string, right: string): boolean {
  const leftHash = createHash('sha256').update(left).digest();
  const rightHash = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function reject(response: Response): void {
  response.setHeader('WWW-Authenticate', REALM);
  response.status(401).send('Authentication required');
}

export function createSwaggerBasicAuth(env: NodeJS.ProcessEnv = process.env) {
  const user = env.SWAGGER_USER ?? '';
  const password = env.SWAGGER_PASSWORD ?? '';

  return (request: Request, response: Response, next: NextFunction): void => {
    if (!user || !password) {
      reject(response);
      return;
    }

    const header = request.headers.authorization;
    if (!header?.startsWith('Basic ')) {
      reject(response);
      return;
    }

    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const separator = decoded.indexOf(':');
    if (separator < 0) {
      reject(response);
      return;
    }

    const login = decoded.slice(0, separator);
    const secret = decoded.slice(separator + 1);
    if (!sameValue(login, user) || !sameValue(secret, password)) {
      reject(response);
      return;
    }

    next();
  };
}
