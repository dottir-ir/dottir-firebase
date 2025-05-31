import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Eye, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { LikeButton } from '../interactions/LikeButton';
import { SaveButton } from '../interactions/SaveButton';
import type { CaseMetadata } from '../../models/Case';

interface CasePreviewProps {
  case: CaseMetadata;
  onComment?: () => void;
}

export const CasePreview: React.FC<CasePreviewProps> = ({
  case: caseData,
  onComment,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <Link to={`/cases/${caseData.id}`} className="block">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{caseData.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">{caseData.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {caseData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="mr-4">
                {formatDistanceToNow(caseData.publishedAt || caseData.createdAt, { addSuffix: true })}
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {caseData.viewCount}
              </span>
            </div>
          </div>

          {caseData.thumbnailUrl && (
            <div className="ml-4 flex-shrink-0">
              <img
                src={caseData.thumbnailUrl}
                alt={caseData.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </Link>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4">
          <LikeButton
            caseId={caseData.id}
            initialLikeCount={caseData.likeCount}
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onComment}
            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-1" />
            <span>{caseData.commentCount}</span>
          </Button>
        </div>

        <SaveButton
          caseId={caseData.id}
          initialSaveCount={caseData.saveCount}
        />
      </div>
    </div>
  );
}; 