import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    //console.log("Entrou em Handle Request")
    //console.log(err)
    //console.log(user)
    if (err || !user) {
      throw new UnauthorizedException(err?.message);
    }

    return user;
  }
}