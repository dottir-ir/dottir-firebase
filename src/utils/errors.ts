import { FirebaseError } from 'firebase/app';

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string = 'unknown',
    public originalError?: FirebaseError
  ) {
    super(message);
    this.name = 'ServiceError';
  }
} 