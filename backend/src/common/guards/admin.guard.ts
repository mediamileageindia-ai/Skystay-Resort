import { Injectable, ExecutionContext, CanActivate, ForbiddenException } from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user    = request.user

    if (!user) {
      throw new ForbiddenException('Authentication required')
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      throw new ForbiddenException('Admin or staff access required')
    }

    return true
  }
}
