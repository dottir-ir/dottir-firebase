import React from 'react';
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  CardActions,
  CardProps as MuiCardProps,
} from '@mui/material';

interface CardProps extends Omit<MuiCardProps, 'variant' | 'title'> {
  title?: string;
  subheader?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'elevation' | 'outlined';
  className?: string;
  onClick?: () => void;
}

export function Card({
  title,
  subheader,
  actions,
  children,
  variant = 'elevation',
  ...props
}: CardProps) {
  return (
    <MuiCard
      variant={variant}
      {...props}
      className={`
        rounded-lg overflow-hidden
        ${props.className || ''}
        ${props.onClick ? 'cursor-pointer' : ''}
      `}
      onClick={props.onClick}
    >
      {(title || subheader) && (
        <MuiCardHeader title={title} subheader={subheader} />
      )}
      <MuiCardContent>{children}</MuiCardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
} 