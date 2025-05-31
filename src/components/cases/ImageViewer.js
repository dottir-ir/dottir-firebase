import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
export const ImageViewer = ({ images, currentIndex, onIndexChange, }) => {
    const handlePrevious = () => {
        onIndexChange((currentIndex - 1 + images.length) % images.length);
    };
    const handleNext = () => {
        onIndexChange((currentIndex + 1) % images.length);
    };
    return (_jsx("div", { className: "relative", children: _jsx(TransformWrapper, { initialScale: 1, minScale: 0.5, maxScale: 4, centerOnInit: true, children: ({ zoomIn, zoomOut, resetTransform }) => (_jsxs(_Fragment, { children: [_jsx("div", { className: "relative aspect-video bg-gray-100 rounded-lg overflow-hidden", children: _jsx(TransformComponent, { children: _jsx("img", { src: images[currentIndex].url, alt: images[currentIndex].alt || `Case image ${currentIndex + 1}`, className: "w-full h-full object-contain" }) }) }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: handlePrevious, className: "bg-white/80 hover:bg-white", children: _jsx(ChevronLeft, { className: "h-6 w-6" }) }) }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: handleNext, className: "bg-white/80 hover:bg-white", children: _jsx(ChevronRight, { className: "h-6 w-6" }) }) }), _jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 rounded-lg p-1", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => zoomIn(), className: "hover:bg-white", children: _jsx(ZoomIn, { className: "h-5 w-5" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => zoomOut(), className: "hover:bg-white", children: _jsx(ZoomOut, { className: "h-5 w-5" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => resetTransform(), className: "hover:bg-white", children: _jsx(RotateCcw, { className: "h-5 w-5" }) })] })] })) }) }));
};
