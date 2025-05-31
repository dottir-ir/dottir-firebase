import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, startAfter, where, onSnapshot, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CaseCard } from './CaseCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useInView } from 'react-intersection-observer';
import { Search, X } from 'lucide-react';
import { Case } from '@/types/case';
export function CaseList() {
    const [cases, setCases] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const { ref, inView } = useInView();
    // Fetch initial cases
    useEffect(() => {
        const fetchInitialCases = async () => {
            const casesRef = collection(db, 'cases');
            const q = query(casesRef, orderBy('createdAt', 'desc'), limit(10));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newCases = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt.toDate(),
                    updatedAt: doc.data().updatedAt.toDate(),
                    publishedAt: doc.data().publishedAt?.toDate(),
                    patientAge: doc.data().patientAge || 0,
                    patientGender: doc.data().patientGender || 'other',
                    clinicalPresentation: doc.data().clinicalPresentation || '',
                    imagingFindings: doc.data().imagingFindings || '',
                    images: doc.data().images || [],
                    authorId: doc.data().authorId || '',
                    authorName: doc.data().authorName || '',
                    authorImage: doc.data().authorImage,
                    viewCount: doc.data().viewCount || 0,
                    likeCount: doc.data().likeCount || 0,
                    commentCount: doc.data().commentCount || 0,
                    saveCount: doc.data().saveCount || 0,
                    likes: doc.data().likes || [],
                    saves: doc.data().saves || [],
                    tags: doc.data().tags || [],
                    teachingPoints: doc.data().teachingPoints || { keyPoints: [] }
                }));
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
    }, [inView]);
    const loadMoreCases = async () => {
        if (!lastDoc)
            return;
        setLoading(true);
        const casesRef = collection(db, 'cases');
        const q = query(casesRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(10));
        const snapshot = await getDocs(q);
        const newCases = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
        }));
        setCases(prev => [...prev, ...newCases]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setLoading(false);
    };
    const handleLike = async (caseId) => {
        const caseRef = doc(db, 'cases', caseId);
        await updateDoc(caseRef, {
            likeCount: increment(1)
        });
    };
    const handleCaseClick = (caseId) => {
        window.location.href = `/cases/${caseId}`;
    };
    const filteredCases = cases.filter(caseItem => {
        const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.every(tag => caseItem.tags.includes(tag));
        return matchesSearch && matchesTags;
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" }), _jsx(Input, { placeholder: "Search cases...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsx(Button, { variant: "outline", onClick: () => setSelectedTags([]), children: "Clear Filters" })] }), _jsx("div", { className: "space-y-4", children: filteredCases.map((caseItem) => (_jsx(CaseCard, { case: caseItem, onLike: handleLike, onClick: handleCaseClick }, caseItem.id))) }), loading && (_jsx("div", { className: "flex justify-center py-4", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) })), _jsx("div", { ref: ref, className: "h-4" })] }));
}
