import React, { useState, useEffect, useCallback, useMemo } from 'react';

export const CasePreviewSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          
          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 bg-gray-200 rounded-full w-20"
              />
            ))}
          </div>
          
          {/* Metadata skeleton */}
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
        </div>
        
        {/* Thumbnail skeleton */}
        <div className="ml-4 flex-shrink-0">
          <div className="w-24 h-24 bg-gray-200 rounded-lg" />
        </div>
      </div>
      
      {/* Interaction buttons skeleton */}
      <div className="flex items-center justify-between pt-4 border-t mt-4">
        <div className="flex items-center space-x-4">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
}; 