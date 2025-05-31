import { FirebaseError } from 'firebase/app';
export class ServiceError extends Error {
    constructor(message, code, originalError) {
        super(message);
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: code
        });
        Object.defineProperty(this, "originalError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: originalError
        });
        this.name = 'ServiceError';
    }
}
export class BaseService {
    handleError(error) {
        if (error instanceof FirebaseError) {
            throw new ServiceError(error.message, error.code, error);
        }
        if (error instanceof Error) {
            throw new ServiceError(error.message, 'unknown', error instanceof FirebaseError ? error : undefined);
        }
        throw new ServiceError('An unknown error occurred', 'unknown');
    }
    async withLoading(operation, onLoadingChange) {
        try {
            onLoadingChange?.(true);
            return await operation();
        }
        finally {
            onLoadingChange?.(false);
        }
    }
}
