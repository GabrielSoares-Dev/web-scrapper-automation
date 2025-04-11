import { Room } from '@domain/entities/room.entity';

describe('Room Entity', () => {
  it('Should be is valid dates', () => {
    const entity = new Room('2025-07-01', '2025-07-03');

    entity.validateDates();
  });

  it('Should throw an error for an invalid check-in date', () => {
    const entity = new Room('invalid-date', '2025-07-03');

    expect(() => entity.validateDates()).toThrow(
      'Invalid check-in date: invalid-date. Expected format: YYYY-MM-DD.',
    );
  });

  it('Should throw an error for an invalid check-out date', () => {
    const entity = new Room('2025-07-01', 'invalid-date');

    expect(() => entity.validateDates()).toThrow(
      'Invalid check-out date: invalid-date. Expected format: YYYY-MM-DD.',
    );
  });

  it('Should throw an error when check-in date is equal to check-out date', () => {
    const entity = new Room('2025-07-01', '2025-07-01');

    expect(() => entity.validateDates()).toThrow(
      'Check-in date must be earlier than check-out date.',
    );
  });

  it('Should throw an error when check-in date is after check-out date', () => {
    const entity = new Room('2025-07-03', '2025-07-01');

    expect(() => entity.validateDates()).toThrow(
      'Check-in date must be earlier than check-out date.',
    );
  });
});
