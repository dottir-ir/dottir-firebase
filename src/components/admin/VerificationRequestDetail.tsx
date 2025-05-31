import { useAuth } from '../../contexts/AuthContext';

export const VerificationRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [request, setRequest] = useState<VerificationRequestWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadRequest = async () => {
      if (!id) return;
      try {
        const data = await verificationService.getVerificationRequestById(id);
        setRequest(data);
      } catch (err) {
        setError('Failed to load verification request');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [id]);

  const handleApprove = async () => {
    if (!id || !currentUser) return;
    setIsSubmitting(true);
    try {
      await verificationService.approveVerificationRequest(id, currentUser.id);
      navigate('/admin/verification');
    } catch (err) {
      setError('Failed to approve request');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!id || !currentUser || !rejectionReason) return;
    setIsSubmitting(true);
    try {
      await verificationService.rejectVerificationRequest(id, currentUser.id, rejectionReason);
      navigate('/admin/verification');
    } catch (err) {
      setError('Failed to reject request');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!request) {
    return <div className="text-red-500 p-4">Request not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Verification Request</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold
            ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
            ${request.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
          `}>
            {request.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Doctor Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {request.user.displayName}</p>
              <p><span className="font-medium">Email:</span> {request.user.email}</p>
              <p><span className="font-medium">Title:</span> {request.user.title}</p>
              {request.user.specialization && (
                <p><span className="font-medium">Specialization:</span> {request.user.specialization}</p>
              )}
              {request.user.institution && (
                <p><span className="font-medium">Institution:</span> {request.user.institution}</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Request Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Submitted:</span> {format(request.submittedAt.toDate(), 'MMM d, yyyy')}</p>
              {request.reviewedAt && (
                <p><span className="font-medium">Reviewed:</span> {format(request.reviewedAt.toDate(), 'MMM d, yyyy')}</p>
              )}
              {request.rejectionReason && (
                <p><span className="font-medium">Rejection Reason:</span> {request.rejectionReason}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Verification Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {request.documents.map((doc, index) => (
              <div key={index} className="border rounded-lg p-4">
                <a
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View Document {index + 1}
                </a>
              </div>
            ))}
          </div>
        </div>

        {request.status === 'pending' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                Rejection Reason (if rejecting)
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting || !rejectionReason}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 