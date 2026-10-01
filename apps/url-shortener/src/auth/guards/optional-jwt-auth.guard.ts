import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Decodes a JWT when present but never rejects the request, so anonymous
 * users can still shorten URLs while logged-in users get their urls
 * attributed to their account.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(err: unknown, user: TUser): TUser {
    return user ?? (null as TUser);
  }
}
