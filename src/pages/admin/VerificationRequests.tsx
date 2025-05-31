import { Routes, Route } from 'react-router-dom';
import { VerificationRequestDetail } from '../../components/admin/VerificationRequestDetail';
import { VerificationRequestList } from '../../components/admin/VerificationRequestList';

const VerificationRequests: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<VerificationRequestList />} />
      <Route path=":id" element={<VerificationRequestDetail />} />
    </Routes>
  );
};

export default VerificationRequests; 