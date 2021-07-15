import { BadRequestException } from '@nestjs/common';
import { DomainError } from '../eventstore';

export const catchError = (error: Error): Error => {
  if (error instanceof DomainError) {
    return new BadRequestException(error.message);
  } else if (error instanceof Error) {
    return new BadRequestException(`Unexpected error: ${error.message}`);
  } else {
    return new BadRequestException('Server error');
  }
};
