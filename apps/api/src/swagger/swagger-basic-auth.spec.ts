import { createSwaggerBasicAuth } from './swagger-basic-auth';

function encode(login: string, password: string): string {
  return `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`;
}

function call(
  middleware: ReturnType<typeof createSwaggerBasicAuth>,
  authorization?: string,
) {
  const response = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const next = jest.fn();
  middleware(
    { headers: { authorization } } as never,
    response as never,
    next,
  );
  return { response, next };
}

describe('createSwaggerBasicAuth', () => {
  const env = { SWAGGER_USER: 'docs', SWAGGER_PASSWORD: 'secret-docs' };

  it('rejects when credentials are not configured', () => {
    const { response, next } = call(createSwaggerBasicAuth({}));
    expect(response.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects a missing authorization header', () => {
    const { response, next } = call(createSwaggerBasicAuth(env));
    expect(response.setHeader).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Basic realm="Raizes API docs"',
    );
    expect(response.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects a wrong password', () => {
    const { response, next } = call(
      createSwaggerBasicAuth(env),
      encode('docs', 'wrong'),
    );
    expect(response.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows the configured login and password', () => {
    const { next } = call(
      createSwaggerBasicAuth(env),
      encode('docs', 'secret-docs'),
    );
    expect(next).toHaveBeenCalled();
  });
});
