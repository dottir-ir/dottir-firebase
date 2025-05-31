import { useAuth } from '../../contexts/AuthContext';

interface CaseImage {
  url: string;
  alt?: string;
}

export const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCase = async () => {
      if (!id) return;
      
      try {
        const caseDoc = await getDoc(doc(db, 'cases', id));
        if (caseDoc.exists()) {
          setCaseData(caseDoc.data() as Case);
        } else {
          setError('Case not found');
        }
      } catch (err) {
        setError('Error loading case');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  const handleLike = async () => {
    if (!currentUser?.uid || !caseData || !id) return;

    try {
      const caseRef = doc(db, 'cases', id);
      const isLiked = caseData.likes.includes(currentUser.uid);

      await updateDoc(caseRef, {
        likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
      });

      setCaseData((prev) => {
        if (!prev) return null;
        const newLikes = isLiked
          ? prev.likes.filter((uid) => uid !== currentUser.uid)
          : [...prev.likes, currentUser.uid];
        return {
          ...prev,
          likes: newLikes,
        } as Case;
      });
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleSave = async () => {
    if (!currentUser?.uid || !caseData || !id) return;

    try {
      const caseRef = doc(db, 'cases', id);
      const isSaved = caseData.saves.includes(currentUser.uid);

      await updateDoc(caseRef, {
        saves: isSaved ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
      });

      setCaseData((prev) => {
        if (!prev) return null;
        const newSaves = isSaved
          ? prev.saves.filter((uid) => uid !== currentUser.uid)
          : [...prev.saves, currentUser.uid];
        return {
          ...prev,
          saves: newSaves,
        } as Case;
      });
    } catch (err) {
      console.error('Error updating save:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || 'Case not found'}</div>
      </div>
    );
  }

  const isLiked = currentUser?.uid ? caseData.likes.includes(currentUser.uid) : false;
  const isSaved = currentUser?.uid ? caseData.saves.includes(currentUser.uid) : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Images */}
        <div className="space-y-4">
          <ImageViewer
            images={caseData.images}
            currentIndex={currentImageIndex}
            onIndexChange={setCurrentImageIndex}
          />
          
          {/* Thumbnail navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {caseData.images.map((image: CaseImage, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${
                  currentImageIndex === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Case image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right column - Case information */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{caseData.title}</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className={isLiked ? 'text-red-500' : ''}
                disabled={!currentUser}
              >
                <Heart className={isLiked ? 'fill-current' : ''} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className={isSaved ? 'text-primary' : ''}
                disabled={!currentUser}
              >
                <Bookmark className={isSaved ? 'fill-current' : ''} />
              </Button>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-600">{caseData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Status</h3>
              <p className="text-gray-600">{caseData.status}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Category</h3>
              <p className="text-gray-600">{caseData.category}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Created</h3>
              <p className="text-gray-600">
                {new Date(caseData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Author</h3>
              <p className="text-gray-600">{caseData.authorName}</p>
            </div>
          </div>

          {/* Comments section */}
          {id && <CommentSection caseId={id} />}
        </div>
      </div>
    </div>
  );
}; 