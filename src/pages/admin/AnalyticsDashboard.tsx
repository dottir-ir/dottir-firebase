import { db } from '../../firebase/config';

interface AnalyticsData {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalCases: number;
  recentActivity: {
    newUsers: number;
    newCases: number;
    verifications: number;
  };
  userGrowth: {
    date: string;
    users: number;
  }[];
  caseDistribution: {
    specialty: string;
    count: number;
  }[];
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Get total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      // Get doctors and patients
      const doctorsSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'doctor'))
      );
      const patientsSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'patient'))
      );

      // Get total cases
      const casesSnapshot = await getDocs(collection(db, 'cases'));
      const totalCases = casesSnapshot.size;

      // Get recent activity (last 7 days)
      const lastWeek = Timestamp.fromDate(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      const newUsersSnapshot = await getDocs(
        query(collection(db, 'users'), where('createdAt', '>=', lastWeek))
      );
      const newCasesSnapshot = await getDocs(
        query(collection(db, 'cases'), where('createdAt', '>=', lastWeek))
      );
      const verificationsSnapshot = await getDocs(
        query(
          collection(db, 'verificationRequests'),
          where('status', '==', 'approved'),
          where('reviewedAt', '>=', lastWeek)
        )
      );

      // Get case distribution by specialty
      const caseDistribution = casesSnapshot.docs.reduce((acc: any, doc) => {
        const specialty = doc.data().specialty || 'Other';
        acc[specialty] = (acc[specialty] || 0) + 1;
        return acc;
      }, {});

      // Get user growth data
      const userGrowth = await getUserGrowthData(timeRange);

      setAnalytics({
        totalUsers,
        totalDoctors: doctorsSnapshot.size,
        totalPatients: patientsSnapshot.size,
        totalCases,
        recentActivity: {
          newUsers: newUsersSnapshot.size,
          newCases: newCasesSnapshot.size,
          verifications: verificationsSnapshot.size,
        },
        userGrowth,
        caseDistribution: Object.entries(caseDistribution).map(([specialty, count]) => ({
          specialty,
          count: count as number,
        })),
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserGrowthData = async (range: 'week' | 'month' | 'year') => {
    const now = new Date();
    let startDate: Date;
    let interval: number;

    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        interval = 30 * 24 * 60 * 60 * 1000; // 30 days
        break;
    }

    const data = [];
    for (let d = startDate; d <= now; d = new Date(d.getTime() + interval)) {
      const nextDate = new Date(d.getTime() + interval);
      const usersSnapshot = await getDocs(
        query(
          collection(db, 'users'),
          where('createdAt', '>=', Timestamp.fromDate(d)),
          where('createdAt', '<', Timestamp.fromDate(nextDate))
        )
      );
      data.push({
        date: d.toLocaleDateString(),
        users: usersSnapshot.size,
      });
    }

    return data;
  };

  if (loading) {
    return <div className="p-4">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-4">Error loading analytics</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded ${
              timeRange === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded ${
              timeRange === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded ${
              timeRange === 'year'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{analytics.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Total Doctors</h3>
          <p className="text-2xl font-bold">{analytics.totalDoctors}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Total Patients</h3>
          <p className="text-2xl font-bold">{analytics.totalPatients}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Total Cases</h3>
          <p className="text-2xl font-bold">{analytics.totalCases}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity (Last 7 Days)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-gray-500 text-sm">New Users</h3>
            <p className="text-xl font-bold">{analytics.recentActivity.newUsers}</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">New Cases</h3>
            <p className="text-xl font-bold">{analytics.recentActivity.newCases}</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Doctor Verifications</h3>
            <p className="text-xl font-bold">{analytics.recentActivity.verifications}</p>
          </div>
        </div>
      </div>

      {/* Case Distribution */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Case Distribution by Specialty</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics.caseDistribution.map(({ specialty, count }) => (
            <div key={specialty} className="p-4 border rounded-lg">
              <h3 className="text-gray-500 text-sm">{specialty}</h3>
              <p className="text-xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 