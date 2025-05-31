import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Case } from '../../types/case';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search } from 'lucide-react';
import { CaseCard } from './CaseCard';

export function CaseList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { ref, inView } = useInView();

  // Fetch initial cases
  useEffect(() => {
    const fetchInitialCases = async () => {
      const casesRef = collection(db, 'cases');
      const q = query(
        casesRef,
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newCases = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
          publishedAt: doc.data().publishedAt?.toDate(),
          patientDemographics: {
            age: doc.data().patientDemographics?.age || 0,
            gender: doc.data().patientDemographics?.gender || 'other',
            presentingComplaint: doc.data().patientDemographics?.presentingComplaint || '',
          },
          clinicalPresentation: doc.data().clinicalPresentation || '',
          imagingFindings: doc.data().imagingFindings || '',
          images: doc.data().images || [],
          authorId: doc.data().authorId || '',
          viewCount: doc.data().viewCount || 0,
          likeCount: doc.data().likeCount || 0,
          commentCount: doc.data().commentCount || 0,
          saveCount: doc.data().saveCount || 0,
          tags: doc.data().tags || [],
          teachingPoints: doc.data().teachingPoints || []
        })) as Case[];
        
        setCases(newCases);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchInitialCases();
  }, []);

  // Load more cases when scrolling
  useEffect(() => {
    if (inView && lastDoc && !loading) {
      loadMoreCases();
    }
  }, [inView, lastDoc, loading]);

  const loadMoreCases = async () => {
    if (!lastDoc) return;

    setLoading(true);
    const casesRef = collection(db, 'cases');
    const q = query(
      casesRef,
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(10)
    );

    const snapshot = await getDocs(q);
    const newCases = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      publishedAt: doc.data().publishedAt?.toDate(),
      patientDemographics: {
        age: doc.data().patientDemographics?.age || 0,
        gender: doc.data().patientDemographics?.gender || 'other',
        presentingComplaint: doc.data().patientDemographics?.presentingComplaint || '',
      },
      clinicalPresentation: doc.data().clinicalPresentation || '',
      imagingFindings: doc.data().imagingFindings || '',
      images: doc.data().images || [],
      authorId: doc.data().authorId || '',
      viewCount: doc.data().viewCount || 0,
      likeCount: doc.data().likeCount || 0,
      commentCount: doc.data().commentCount || 0,
      saveCount: doc.data().saveCount || 0,
      tags: doc.data().tags || [],
      teachingPoints: doc.data().teachingPoints || []
    })) as Case[];

    setCases(prev => [...prev, ...newCases]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
  };

  const handleLike = async (caseId: string) => {
    const caseRef = doc(db, 'cases', caseId);
    await updateDoc(caseRef, {
      likeCount: increment(1)
    });
  };

  const handleCaseClick = (caseId: string) => {
    window.location.href = `/cases/${caseId}`;
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => caseItem.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setSelectedTags([])}>
          Clear Filters
        </Button>
      </div>

      <div className="space-y-4">
        {filteredCases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            case={caseItem}
            onLike={handleLike}
            onClick={handleCaseClick}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      <div ref={ref} className="h-4" />
    </div>
  );
} 