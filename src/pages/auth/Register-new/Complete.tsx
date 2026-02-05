import { useNavigate } from 'react-router-dom';
import { RegisterComplete } from '@features/01-auth';

const RegisterCompletePageWrapper = () => {
  const navigate = useNavigate();

  const savedInfo = sessionStorage.getItem('register_scholar_info');
  const scholarInfo = savedInfo ? JSON.parse(savedInfo) : { name: '' };

  const handleContinue = () => {
    sessionStorage.removeItem('register_member_type');
    sessionStorage.removeItem('register_scholar_info');
    sessionStorage.removeItem('register_credentials');
    navigate('/onboarding');
  };

  return (
    <RegisterComplete
      userName={scholarInfo.name}
      onContinue={handleContinue}
      autoNavigateDelay={3000}
    />
  );
};

export default RegisterCompletePageWrapper;
