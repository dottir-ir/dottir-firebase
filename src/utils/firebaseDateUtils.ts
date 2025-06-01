import { Timestamp } from 'firebase/firestore';

/**
 * Converts a Firebase Timestamp to a JavaScript Date
 */
export function convertFirebaseTimestamp(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

/**
 * Converts a JavaScript Date to a Firebase Timestamp
 */
export function convertToFirebaseTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

/**
 * Safely converts a date-like value to a Firebase Timestamp
 * Handles both Date objects and existing Timestamps
 */
export function toFirebaseTimestamp(value: Date | Timestamp | null | undefined): Timestamp | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value;
  if (value instanceof Date) return Timestamp.fromDate(value);
  return null;
}

/**
 * Safely converts a date-like value to a JavaScript Date
 * Handles both Date objects and Timestamps
 */
export function toDate(value: Date | Timestamp | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  return null;
}

/**
 * Validates if a value is a valid date that can be stored in Firebase
 */
export function isValidFirebaseDate(value: any): boolean {
  if (!value) return false;
  if (value instanceof Date) return !isNaN(value.getTime());
  if (value instanceof Timestamp) return true;
  return false;
} 