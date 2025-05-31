import { useAuth } from '../../contexts/AuthContext';

interface VerificationRequest {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  documents: {
    license: string;
    certification: string;
    idProof: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

const DoctorVerification: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      const q = query(
        collection(db, 'verificationRequests'),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      const requestsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt.toDate(),
      })) as VerificationRequest[];
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const requestRef = doc(db, 'verificationRequests', requestId);
      await updateDoc(requestRef, {
        status,
        reviewedBy: currentUser?.uid,
        reviewedAt: new Date(),
      });

      // Update user role if approved
      if (status === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const userRef = doc(db, 'users', request.userId);
          await updateDoc(userRef, {
            role: 'doctor',
            isVerified: true,
          });
        }
      }

      // Refresh the list
      await fetchVerificationRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Doctor Verification Requests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No pending verification requests</p>
          ) : (
            <div className="space-y-4">
              {requests.map(request => (
                <div
                  key={request.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedRequest?.id === request.id ? 'border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <h3 className="font-medium">{request.displayName}</h3>
                  <p className="text-sm text-gray-600">{request.email}</p>
                  <p className="text-sm text-gray-500">
                    Submitted: {request.submittedAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Document Viewer */}
        <div className="bg-white rounded-lg shadow p-4">
          {selectedRequest ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Documents for {selectedRequest.displayName}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Medical License</h3>
                  <img
                    src={selectedRequest.documents.license}
                    alt="Medical License"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Certification</h3>
                  <img
                    src={selectedRequest.documents.certification}
                    alt="Certification"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-2">ID Proof</h3>
                  <img
                    src={selectedRequest.documents.idProof}
                    alt="ID Proof"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => handleVerification(selectedRequest.id, 'approved')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerification(selectedRequest.id, 'rejected')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a request to view documents
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVerification; 