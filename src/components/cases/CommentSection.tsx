import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';

interface DropdownMenuContext {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

interface CommentSectionProps {
  caseId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ caseId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, `cases/${caseId}/comments`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [caseId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    try {
      await addDoc(collection(db, `cases/${caseId}/comments`), {
        content: newComment.trim(),
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anonymous',
        authorImage: currentUser.photoURL,
        createdAt: Timestamp.now(),
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateDoc(doc(db, `cases/${caseId}/comments/${commentId}`), {
        content: editContent.trim(),
        updatedAt: Timestamp.now(),
      });
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteDoc(doc(db, `cases/${caseId}/comments/${commentId}`));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Comments</h2>

      {/* Add comment form */}
      {currentUser && (
        <form onSubmit={handleAddComment} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </form>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            {editingComment === comment.id ? (
              <div className="space-y-4">
                <Textarea
                  value={editContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditComment(comment.id)}
                    disabled={!editContent.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={comment.authorImage}
                      alt={comment.authorName}
                      fallback={comment.authorName.charAt(0).toUpperCase()}
                    />
                    <div>
                      <p className="font-medium">{comment.authorName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt.toDate()).toLocaleString()}
                        {comment.updatedAt && ' (edited)'}
                      </p>
                    </div>
                  </div>
                  {currentUser?.uid === comment.authorId && (
                    <DropdownMenu>
                      {(context: DropdownMenuContext) => (
                        <>
                          <DropdownMenuTrigger asChild setOpen={context.setOpen}>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" open={context.open}>
                            <DropdownMenuItem onClick={() => startEditing(comment)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </>
                      )}
                    </DropdownMenu>
                  )}
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 