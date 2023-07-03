import { DomainError } from '@aulasoftwarelibre/nestjs-eventstore';
import { BadRequestException } from '@nestjs/common';

export const catchError = (error: Error): Error => {
  if (error instanceof DomainError) {
    return new BadRequestException(error.message);
  } else if (error instanceof Error) {
    return new BadRequestException(`Unexpected error: ${error.message}`);
  } else {
    return new BadRequestException('Server error');
  }
};
