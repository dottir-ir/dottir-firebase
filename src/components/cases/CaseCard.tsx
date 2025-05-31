import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Case } from '../../types/case';

interface CaseCardProps {
  case: Case;
  onLike: (caseId: string) => void;
  onClick: (caseId: string) => void;
}

export function CaseCard({ case: caseData, onLike, onClick }: CaseCardProps) {
  return (
    <Card 
      className="w-full hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(caseData.id)}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <img 
            src={caseData.authorImage || ''} 
            alt={caseData.title}
          />
          <span>{caseData.title[0]}</span>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{caseData.title}</h3>
          <div className="text-sm text-muted-foreground">
            {caseData.patientDemographics.age}y • {caseData.patientDemographics.gender}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {caseData.tags.map((tag) => (
            <Badge 
              key={tag} 
              label={tag}
              status="default"
              chipVariant="outlined"
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(caseData.id);
            }}
            className="flex items-center gap-1 hover:text-primary"
          >
            <Heart className="h-4 w-4" />
            <span>{caseData.likeCount}</span>
          </button>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{caseData.commentCount}</span>
          </div>
        </div>
        <span>{formatDistanceToNow(caseData.createdAt, { addSuffix: true })}</span>
      </CardFooter>
    </Card>
  );
} 