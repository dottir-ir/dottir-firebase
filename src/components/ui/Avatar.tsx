import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface AvatarProps {
  children: React.ReactNode;
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

export const Avatar = ({ children, ...props }: AvatarProps) => {
  return <div className="avatar" {...props}>{children}</div>;
};

export const AvatarImage = ({ src, alt, ...props }: AvatarImageProps) => {
  return <img src={src} alt={alt} className="avatar-image" {...props} />;
};

export const AvatarFallback = ({ children, ...props }: AvatarFallbackProps) => {
  return <div className="avatar-fallback" {...props}>{children}</div>;
}; 