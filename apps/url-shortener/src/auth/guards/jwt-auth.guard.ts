import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Requires a valid JWT. Used for endpoints only the owner may call. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
