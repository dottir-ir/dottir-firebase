import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../lib/utils';
export const Avatar = ({ src, alt, fallback, className, ...props }) => {
    const [error, setError] = React.useState(false);
    return (_jsx("div", { className: cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className), ...props, children: src && !error ? (_jsx("img", { src: src, alt: alt, className: "aspect-square h-full w-full object-cover", onError: () => setError(true) })) : (_jsx("div", { className: "flex h-full w-full items-center justify-center rounded-full bg-muted", children: _jsx("span", { className: "text-sm font-medium text-muted-foreground", children: fallback }) })) }));
};
