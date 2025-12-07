import { inject, injectable } from 'inversify';
import { SignJWT, jwtVerify } from 'jose';
import { Config } from '../config/index.js';
import { RestSchema } from '../config/rest.schema.js';
import { Component } from '../../types/index.js';

@injectable()
export class JwtService {
  private readonly secret: Uint8Array;

  constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    this.secret = new TextEncoder().encode(this.config.get('JWT_SECRET'));
  }

  public async sign(payload: { email: string; id: string }): Promise<string> {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(this.secret);

    return jwt;
  }

  public async verify(token: string): Promise<{ email: string; id: string }> {
    const { payload } = await jwtVerify(token, this.secret);
    return payload as { email: string; id: string };
  }
}


