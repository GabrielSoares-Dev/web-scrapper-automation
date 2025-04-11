import { BusinessException } from '@application/exceptions/business.exception';

export class Room {
  private checkIn: string;
  private checkOut: string;

  constructor(checkIn: string, checkOut: string) {
    this.checkIn = checkIn;
    this.checkOut = checkOut;
  }

  public validateDates(): void {
    const checkInDate = new Date(this.checkIn);
    const checkOutDate = new Date(this.checkOut);

    const isCheckInInvalid = isNaN(checkInDate.getTime());
    if (isCheckInInvalid) {
      throw new BusinessException(
        `Invalid check-in date: ${this.checkIn}. Expected format: YYYY-MM-DD.`,
      );
    }

    const isCheckOutInvalid = isNaN(checkOutDate.getTime());
    if (isCheckOutInvalid) {
      throw new BusinessException(
        `Invalid check-out date: ${this.checkOut}. Expected format: YYYY-MM-DD.`,
      );
    }

    const isCheckInAfterOrEqualToCheckOut = checkInDate >= checkOutDate;
    if (isCheckInAfterOrEqualToCheckOut) {
      throw new BusinessException(
        'Check-in date must be earlier than check-out date.',
      );
    }
  }
}
