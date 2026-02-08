import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterTypeSelectPage } from '@features/01-auth';

export type MemberType = 'middle_high' | 'university' | 'graduate';

const RegisterTypePageWrapper = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<MemberType | null>(null);

  const handleBack = () => {
    navigate('/login');
  };

  const handleSelectType = (type: MemberType) => {
    setSelectedType(type);
    sessionStorage.setItem('register_member_type', type);
    navigate('/register/scholarship');
  };

  return (
    <RegisterTypeSelectPage
      onBack={handleBack}
      onSelectType={handleSelectType}
      selectedType={selectedType}
    />
  );
};

export default RegisterTypePageWrapper;
