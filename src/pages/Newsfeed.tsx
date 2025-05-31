import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Filter, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CaseService } from '@/services/CaseService';
import type { CaseMetadata } from '../types/case';
import type { DocumentData } from 'firebase/firestore';
import { CasePreview } from '../components/cases/CasePreview';
import { CasePreviewSkeleton } from '../components/cases/CasePreviewSkeleton';
import { Loader2 } from 'lucide-react';

const PAGE_SIZE = 10;

type SortOption = 'recent' | 'popular' | 'trending';

interface NewsfeedFilters {
  category?: string;
  tags?: string[];
  sortBy: SortOption;
}

interface NewsfeedOptions {
  pageSize: number;
  lastDoc?: DocumentData;
  filters: NewsfeedFilters;
}

export const NewsfeedPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cases, setCases] = useState<CaseMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
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
      setSortBy(sort as SortOption);
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
      
      const options: NewsfeedOptions = {
        pageSize: PAGE_SIZE,
        filters: {
          category: selectedCategory || undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          sortBy
        }
      };
      
      const { cases: initialCases, lastDoc: newLastDoc } = await caseService.getCasesForNewsfeed(options);
      
      setCases(initialCases);
      setLastDoc(newLastDoc);
      setHasMore(initialCases.length === PAGE_SIZE);
    } catch (err) {
      setError('Failed to load cases. Please try again.');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedTags, sortBy]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !lastDoc) return;

    try {
      setLoading(true);
      const options: NewsfeedOptions = {
        pageSize: PAGE_SIZE,
        lastDoc,
        filters: {
          category: selectedCategory || undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          sortBy
        }
      };

      const { cases: newCases, lastDoc: newLastDoc } = await caseService.getCasesForNewsfeed(options);

      setCases(prev => [...prev, ...newCases]);
      setLastDoc(newLastDoc);
      setHasMore(newCases.length === PAGE_SIZE);
    } catch (err) {
      setError('Failed to load more cases. Please try again.');
      console.error('Error loading more cases:', err);
    } finally {
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

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCases([]);
    setLastDoc(null);
    setHasMore(true);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCases([]);
    setLastDoc(null);
    setHasMore(true);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCases([]);
    setLastDoc(null);
    setHasMore(true);
    setSearchParams({ sort: newSort });
  };

  const handleComment = (caseId: string) => {
    if (!currentUser) {
      // Show login prompt or redirect to login
      return;
    }
    // Navigate to case detail page with comment section focused
    window.location.href = `/cases/${caseId}#comments`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medical Cases</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Sort By</h3>
              <div className="flex space-x-4">
                {(['recent', 'popular', 'trending'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`px-4 py-2 rounded-lg ${
                      sortBy === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(
                      selectedCategory === category ? null : category
                    )}
                    className={`px-3 py-1 rounded-full ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && cases.length === 0 ? (
          Array.from({ length: 6 }).map((_, index) => (
            <CasePreviewSkeleton key={index} />
          ))
        ) : (
          cases.map((caseData) => (
            <CasePreview
              key={caseData.id}
              case={caseData}
              onComment={() => handleComment(caseData.id)}
            />
          ))
        )}
      </div>

      {loading && cases.length > 0 && (
        <div className="flex justify-center mt-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {!loading && hasMore && (
        <div ref={ref} className="h-10" />
      )}
    </div>
  );
}; 