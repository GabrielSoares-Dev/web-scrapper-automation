import { UserEntityInputDto } from '@application/dtos/entities/user.dto';
import { BusinessException } from '@application/exceptions/business.exception';

export class User {
  constructor(private readonly input: UserEntityInputDto) {}

  private validateName(): boolean {
    return this.input.name.length > 0;
  }

  private validateEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(this.input.email);
  }

  private validatePhoneNumber(): boolean {
    const minimumCharactersLenght = 11;
    return this.input.phoneNumber.length === minimumCharactersLenght;
  }

  private validatePassword(): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

    return passwordRegex.test(this.input.password);
  }

  create(): void {
    const invalidName = !this.validateName();
    if (invalidName) throw new BusinessException('Invalid name');

    const invalidEmail = !this.validateEmail();
    if (invalidEmail) throw new BusinessException('Invalid email');

    const invalidPhoneNumber = !this.validatePhoneNumber();
    if (invalidPhoneNumber) throw new BusinessException('Invalid phoneNumber');

    const invalidPassword = !this.validatePassword();
    if (invalidPassword) throw new BusinessException('Invalid password');
  }
}
