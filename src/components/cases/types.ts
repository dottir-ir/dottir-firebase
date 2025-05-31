import type { Case } from '../../types/case';

export interface CaseCardProps {
  case: Case;
  onLike: (caseId: string) => void;
  onClick: (caseId: string) => void;
} 