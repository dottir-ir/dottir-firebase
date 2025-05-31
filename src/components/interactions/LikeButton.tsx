import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CaseService } from '@/services/CaseService';
import { useAuth } from '@/hooks/useAuth';

interface LikeButtonProps {
  caseId: string;
  initialLikeCount: number;
  initialIsLiked?: boolean;
  onLikeChange?: (newLikeCount: number, isLiked: boolean) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  caseId,
  initialLikeCount,
  initialIsLiked = false,
  onLikeChange,
}) => {
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user: currentUser } = useAuth();
  const caseService = new CaseService();

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!currentUser?.id) return;
      try {
        const liked = await caseService.isLiked(caseId, currentUser.id);
        setIsLiked(liked);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    checkLikeStatus();
  }, [caseId, currentUser?.id]);

  const handleLike = async () => {
    if (!currentUser?.id) {
      toast.error('Please sign in to like cases');
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        await caseService.unlikeCase(caseId, currentUser.id);
        setLikeCount((prev: number) => prev - 1);
        setIsLiked(false);
        onLikeChange?.(likeCount - 1, false);
      } else {
        await caseService.likeCase(caseId, currentUser.id);
        setLikeCount((prev: number) => prev + 1);
        setIsLiked(true);
        onLikeChange?.(likeCount + 1, true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center space-x-1 ${
        isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'
      }`}
    >
      <Heart
        className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
      />
      <span>{likeCount}</span>
    </Button>
  );
}; 