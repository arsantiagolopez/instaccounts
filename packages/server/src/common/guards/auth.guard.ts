import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/auth/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { cookie } = req?.headers;

    // Get everything after "next-auth.session-token="
    let sessionToken = cookie?.split('next-auth.session-token=')[1];

    // Sometimes, other params are passed after token
    if (sessionToken?.includes(';')) {
      sessionToken = sessionToken?.split(';')[0];
    }

    if (!sessionToken) {
      return false;
    }

    const session = await this.sessionRepository.findOne({
      where: { sessionToken },
    });

    if (!session) {
      return false;
    }

    // Store userId in request for further auth in routes
    // @ts-ignore
    if (req.userId !== session?.userId) {
      req.userId = session?.userId;
    }

    return !!req.userId;
  }
}
