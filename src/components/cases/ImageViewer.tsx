import React from 'react';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface Image {
  url: string;
  alt?: string;
}

interface ImageViewerProps {
  images: Image[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

interface TransformWrapperProps {
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  onIndexChange,
}) => {
  const handlePrevious = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  return (
    <div className="relative">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }: TransformWrapperProps) => (
          <>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <TransformComponent>
                <img
                  src={images[currentIndex].url}
                  alt={images[currentIndex].alt || `Case image ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </TransformComponent>
            </div>

            {/* Navigation buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="bg-white/80 hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="bg-white/80 hover:bg-white"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => zoomIn()}
                className="hover:bg-white"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => zoomOut()}
                className="hover:bg-white"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => resetTransform()}
                className="hover:bg-white"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}; 