import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../lib/utils';
export const DropdownMenu = ({ children }) => {
    const [open, setOpen] = React.useState(false);
    return (_jsx("div", { className: "relative inline-block text-left", children: children({ open, setOpen }) }));
};
export const DropdownMenuTrigger = ({ children, asChild, setOpen, ...props }) => {
    const handleClick = () => {
        setOpen((prev) => !prev);
    };
    if (asChild) {
        return React.cloneElement(children, {
            onClick: handleClick,
        });
    }
    return (_jsx("button", { type: "button", onClick: handleClick, className: "inline-flex items-center justify-center", ...props, children: children }));
};
export const DropdownMenuContent = ({ children, align = 'end', className, open, ...props }) => {
    if (!open)
        return null;
    return (_jsx("div", { className: cn('absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', {
            'right-0': align === 'end',
            'left-0': align === 'start',
            'left-1/2 -translate-x-1/2': align === 'center',
        }, className), ...props, children: children }));
};
export const DropdownMenuItem = ({ children, className, onClick, ...props }) => {
    return (_jsx("button", { className: cn('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className), onClick: onClick, ...props, children: children }));
};
