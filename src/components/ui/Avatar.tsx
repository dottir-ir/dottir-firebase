import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface AvatarImageProps {
  src: string;
  alt: string;
  [key: string]: any;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  [key: string]: any;
}

export const Avatar = ({ src, alt, fallback, className, ...props }: AvatarProps) => {
  const [error, setError] = useState(false);
  
  return (
    <div 
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', 
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img 
          src={src} 
          alt={alt || ''} 
          className="aspect-square h-full w-full object-cover" 
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <span className="text-sm font-medium text-muted-foreground">{fallback}</span>
        </div>
      )}
    </div>
  );
};

export const AvatarImage = ({ src, alt, ...props }: AvatarImageProps) => {
  return <img src={src} alt={alt} className="avatar-image" {...props} />;
};

export const AvatarFallback = ({ children, ...props }: AvatarFallbackProps) => {
  return <div className="avatar-fallback" {...props}>{children}</div>;
}; 