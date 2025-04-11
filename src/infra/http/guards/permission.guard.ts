import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CheckPermissionUseCase } from '@application/useCases/auth/checkPermission.usecase';
import { RequestWithUser } from '@infra/types/requestWithUser.type';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly useCase: CheckPermissionUseCase,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const expectedPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const userPermissions = request.user.permissions;
    try {
      await this.useCase.run({ expectedPermission, userPermissions });
    } catch (error) {
      throw new HttpException(
        'Access to this resource was denied',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
