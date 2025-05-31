import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface DropdownMenuProps {
  children: (context: DropdownMenuContext) => React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'end' | 'center';
  className?: string;
  open: boolean;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface DropdownMenuContext {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      {children({ open, setOpen })}
    </div>
  );
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild,
  setOpen,
  ...props
}) => {
  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center"
      {...props}
    >
      {children}
    </button>
  );
};

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'end',
  className,
  open,
  ...props
}) => {
  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        {
          'right-0': align === 'end',
          'left-0': align === 'start',
          'left-1/2 -translate-x-1/2': align === 'center',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <button
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}; 