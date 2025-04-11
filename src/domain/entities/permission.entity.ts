import { PermissionEntityInputDto } from '@application/dtos/entities/permission.dto';
import { BusinessException } from '@application/exceptions/business.exception';

export class Permission {
  constructor(private readonly input: PermissionEntityInputDto) {}

  private validateName(): boolean {
    return this.input.name.length > 0;
  }

  create(): void {
    const invalidName = !this.validateName();
    if (invalidName) throw new BusinessException('Invalid name');
  }
}
