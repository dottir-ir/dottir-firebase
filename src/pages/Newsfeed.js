import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';
import { CaseService } from '../services/CaseService';
import { CasePreview } from '../components/cases/CasePreview';
import { CasePreviewSkeleton } from '../components/cases/CasePreviewSkeleton';
import { CaseMetadata } from '../models/Case';
import { DocumentData } from 'firebase/firestore';
import { Loader2, Filter, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const PAGE_SIZE = 10;
export const NewsfeedPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [categories, setCategories] = useState([]);
    const [popularTags, setPopularTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortBy, setSortBy] = useState('recent');
    const [showFilters, setShowFilters] = useState(false);
    const { currentUser } = useAuth();
    const { ref, inView } = useInView({
        threshold: 0,
    });
    const caseService = new CaseService();
    // Initialize sort from URL params
    useEffect(() => {
        const sort = searchParams.get('sort');
        if (sort && ['recent', 'popular', 'trending'].includes(sort)) {
            setSortBy(sort);
        }
    }, [searchParams]);
    const loadInitialData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [categoriesData, tagsData] = await Promise.all([
                caseService.getCategories(),
                caseService.getPopularTags()
            ]);
            setCategories(categoriesData);
            setPopularTags(tagsData);
            const { cases: initialCases, lastDoc: newLastDoc } = await caseService.getCasesForNewsfeed({
                pageSize: PAGE_SIZE,
                filters: {
                    category: selectedCategory || undefined,
                    tags: selectedTags.length > 0 ? selectedTags : undefined,
                    sortBy
                }
            });
            setCases(initialCases);
            setLastDoc(newLastDoc);
            setHasMore(initialCases.length === PAGE_SIZE);
        }
        catch (err) {
            setError('Failed to load cases. Please try again.');
            console.error('Error loading initial data:', err);
        }
        finally {
            setLoading(false);
        }
    }, [selectedCategory, selectedTags, sortBy]);
    const loadMore = useCallback(async () => {
        if (!hasMore || loading || !lastDoc)
            return;
        try {
            setLoading(true);
            const { cases: newCases, lastDoc: newLastDoc } = await caseService.getCasesForNewsfeed({
                pageSize: PAGE_SIZE,
                lastDoc,
                filters: {
                    category: selectedCategory || undefined,
                    tags: selectedTags.length > 0 ? selectedTags : undefined,
                    sortBy
                }
            });
            setCases(prev => [...prev, ...newCases]);
            setLastDoc(newLastDoc);
            setHasMore(newCases.length === PAGE_SIZE);
        }
        catch (err) {
            setError('Failed to load more cases. Please try again.');
            console.error('Error loading more cases:', err);
        }
        finally {
            setLoading(false);
        }
    }, [hasMore, loading, lastDoc, selectedCategory, selectedTags, sortBy]);
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);
    useEffect(() => {
        if (inView) {
            loadMore();
        }
    }, [inView, loadMore]);
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCases([]);
        setLastDoc(null);
        setHasMore(true);
    };
    const handleTagToggle = (tag) => {
        setSelectedTags(prev => prev.includes(tag)
            ? prev.filter(t => t !== tag)
            : [...prev, tag]);
        setCases([]);
        setLastDoc(null);
        setHasMore(true);
    };
    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setCases([]);
        setLastDoc(null);
        setHasMore(true);
        setSearchParams({ sort: newSort });
    };
    const handleComment = (caseId) => {
        if (!currentUser) {
            // Show login prompt or redirect to login
            return;
        }
        // Navigate to case detail page with comment section focused
        window.location.href = `/cases/${caseId}#comments`;
    };
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Medical Cases" }), _jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: [_jsx(Filter, { className: "w-5 h-5 mr-2" }), "Filters"] })] }), showFilters && (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Filters" }), _jsx("button", { onClick: () => setShowFilters(false), className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Sort By" }), _jsx("div", { className: "flex space-x-4", children: ['recent', 'popular', 'trending'].map((option) => (_jsx("button", { onClick: () => handleSortChange(option), className: `px-4 py-2 rounded-lg ${sortBy === option
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: option.charAt(0).toUpperCase() + option.slice(1) }, option))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Categories" }), _jsx("div", { className: "flex flex-wrap gap-2", children: categories.map((category) => (_jsx("button", { onClick: () => handleCategoryChange(selectedCategory === category ? null : category), className: `px-3 py-1 rounded-full ${selectedCategory === category
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: category }, category))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Popular Tags" }), _jsx("div", { className: "flex flex-wrap gap-2", children: popularTags.map((tag) => (_jsx("button", { onClick: () => handleTagToggle(tag), className: `px-3 py-1 rounded-full ${selectedTags.includes(tag)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: tag }, tag))) })] })] })] })), error && (_jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: [error, _jsx("button", { onClick: loadInitialData, className: "ml-4 text-red-700 underline", children: "Try Again" })] })), _jsx("div", { className: "space-y-4", children: loading && cases.length === 0 ? (
                // Show skeleton loaders when initially loading
                Array.from({ length: 3 }).map((_, index) => (_jsx(CasePreviewSkeleton, {}, index)))) : (
                // Show actual cases
                cases.map((caseData) => (_jsx(CasePreview, { case: caseData, onComment: () => handleComment(caseData.id) }, caseData.id)))) }), loading && cases.length > 0 && (_jsx("div", { className: "flex justify-center py-8", children: _jsx(Loader2, { className: "w-8 h-8 text-blue-600 animate-spin" }) })), !loading && cases.length === 0 && !error && (_jsxs("div", { className: "text-center py-12", children: [_jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "No cases found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your filters or check back later for new cases." })] })), _jsx("div", { ref: ref, className: "h-10" })] }));
};
