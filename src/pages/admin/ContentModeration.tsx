import { useAuth } from '../../contexts/AuthContext';

interface ReportedContent {
  id: string;
  contentType: 'case' | 'comment' | 'profile';
  contentId: string;
  reportedBy: string;
  reportedByEmail: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'removed';
  reportedAt: Date;
  content: {
    title?: string;
    text?: string;
    author?: string;
  };
}

const ContentModeration: React.FC = () => {
  const [reports, setReports] = useState<ReportedContent[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchReportedContent();
  }, []);

  const fetchReportedContent = async () => {
    try {
      const q = query(
        collection(db, 'reportedContent'),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: doc.data().reportedAt.toDate(),
      })) as ReportedContent[];
      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching reported content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (reportId: string, action: 'reviewed' | 'removed') => {
    try {
      const reportRef = doc(db, 'reportedContent', reportId);
      const report = reports.find(r => r.id === reportId);
      
      if (!report) return;

      // Update report status
      await updateDoc(reportRef, {
        status: action,
        moderatedBy: currentUser?.uid,
        moderatedAt: new Date(),
      });

      // If content is removed, delete the original content
      if (action === 'removed') {
        const contentRef = doc(db, report.contentType + 's', report.contentId);
        await deleteDoc(contentRef);
      }

      // Refresh the list
      await fetchReportedContent();
      setSelectedReport(null);
    } catch (error) {
      console.error('Error moderating content:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Content Moderation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reports List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Reported Content</h2>
          {reports.length === 0 ? (
            <p className="text-gray-500">No pending reports</p>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <div
                  key={report.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedReport?.id === report.id ? 'border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium capitalize">{report.contentType}</h3>
                      <p className="text-sm text-gray-600">
                        Reported by: {report.reportedByEmail}
                      </p>
                      <p className="text-sm text-gray-500">
                        Reported: {report.reportedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">
                      {report.reason}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Review */}
        <div className="bg-white rounded-lg shadow p-4">
          {selectedReport ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Content Review</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Content Type</h3>
                  <p className="capitalize">{selectedReport.contentType}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Report Reason</h3>
                  <p className="text-red-600">{selectedReport.reason}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Content</h3>
                  {selectedReport.content.title && (
                    <p className="font-medium">{selectedReport.content.title}</p>
                  )}
                  {selectedReport.content.text && (
                    <p className="mt-2">{selectedReport.content.text}</p>
                  )}
                  {selectedReport.content.author && (
                    <p className="text-sm text-gray-600 mt-2">
                      Author: {selectedReport.content.author}
                    </p>
                  )}
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => handleModeration(selectedReport.id, 'reviewed')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Mark as Reviewed
                  </button>
                  <button
                    onClick={() => handleModeration(selectedReport.id, 'removed')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove Content
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a report to review content
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentModeration; 