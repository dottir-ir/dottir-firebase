import { FirebaseError } from 'firebase/app';
import { ServiceError } from '@/utils/errors';

export abstract class BaseService {
  protected handleError(error: unknown): never {
    if (error instanceof FirebaseError) {
      throw new ServiceError(error.message, error.code, error);
    }
    if (error instanceof Error) {
      throw new ServiceError(error.message, 'unknown', error instanceof FirebaseError ? error : undefined);
    }
    throw new ServiceError('An unknown error occurred', 'unknown');
  }

  protected async withLoading<T>(
    operation: () => Promise<T>,
    onLoadingChange?: (loading: boolean) => void
  ): Promise<T> {
    try {
      onLoadingChange?.(true);
      return await operation();
    } finally {
      onLoadingChange?.(false);
    }
  }
} 