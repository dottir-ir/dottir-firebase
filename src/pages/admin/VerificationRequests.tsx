import { VerificationRequestDetail } from '../../components/admin/VerificationRequestDetail';

const VerificationRequests: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<VerificationRequestList />} />
      <Route path=":id" element={<VerificationRequestDetail />} />
    </Routes>
  );
};

export default VerificationRequests; 