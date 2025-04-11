import { RoleEntityInputDto } from '@application/dtos/entities/role.dto';
import { BusinessException } from '@application/exceptions/business.exception';

export class Role {
  constructor(private readonly input: RoleEntityInputDto) {}

  private validateName(): boolean {
    return this.input.name.length > 0;
  }

  create(): void {
    const invalidName = !this.validateName();
    if (invalidName) throw new BusinessException('Invalid name');
  }
}
