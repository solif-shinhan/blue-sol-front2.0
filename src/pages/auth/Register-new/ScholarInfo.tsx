import { useNavigate } from 'react-router-dom';
import { RegisterScholarInfoPage } from '@features/01-auth';
import type { MemberType } from './index';

interface ScholarInfoFormData {
  name: string;
  scholarNumber: string;
  phone: string;
  email: string;
  region: string;
  school: string;
}

const RegisterInfoPageWrapper = () => {
  const navigate = useNavigate();
  const memberType = sessionStorage.getItem('register_member_type') as MemberType | null;

  const savedData = sessionStorage.getItem('register_scholar_info');
  const initialData: ScholarInfoFormData = savedData
    ? JSON.parse(savedData)
    : { name: '', scholarNumber: '', phone: '', email: '', region: '', school: '' };

  const handleBack = () => {
    navigate('/register');
  };

  const handleNext = (data: ScholarInfoFormData) => {
    sessionStorage.setItem('register_scholar_info', JSON.stringify(data));
    navigate('/register/scholarship/credentials');
  };

  return (
    <RegisterScholarInfoPage
      onBack={handleBack}
      onNext={handleNext}
      initialData={initialData}
      memberType={memberType}
    />
  );
};

export default RegisterInfoPageWrapper;
