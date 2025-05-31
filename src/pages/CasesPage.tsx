import { CaseList } from '@/components/cases/CaseList';

export function CasesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Medical Cases</h1>
      <CaseList />
    </div>
  );
} 