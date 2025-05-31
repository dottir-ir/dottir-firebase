import type { ReactNode } from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  children?: ReactNode;
}

export const Avatar: React.FC<AvatarProps>; 