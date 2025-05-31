/// <reference types="vitest" />

declare module '@testing-library/react' {
  export function render(ui: React.ReactElement, options?: any): any;
  export const screen: {
    getByText: (text: string) => HTMLElement;
    getByTestId: (id: string) => HTMLElement;
    queryByText: (text: string) => HTMLElement | null;
    queryByTestId: (id: string) => HTMLElement | null;
  };
  export const fireEvent: any;
  export const waitFor: any;
}

declare module '@/test/mocks/AuthProvider' {
  import { FC, ReactNode } from 'react';
  export const MockAuthProvider: FC<{ children: ReactNode }>;
}

declare module '@/test/mocks/data' {
  import { User } from '@/types/user';
  import { Case } from '@/types/case';
  import { Comment } from '@/types/comment';

  export const mockUser: User;
  export const mockCase: Case;
  export const mockComment: Comment;
} 