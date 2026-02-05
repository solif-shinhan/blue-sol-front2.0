import { useNavigate } from 'react-router-dom';
import { CardColorSelect } from '@features/02-onboarding';
import { useOnboardingContext } from '@features/02-onboarding/context/OnboardingContext';

const OnboardingColorPageWrapper = () => {
  const navigate = useNavigate();
  const { data, setColorId, editMode, setEditMode } = useOnboardingContext();
  const userName = localStorage.getItem('userName') || '';

  // registerData에서 학교 정보 가져오기
  const registerDataStr = localStorage.getItem('registerData');
  const registerData = registerDataStr ? JSON.parse(registerDataStr) : {};
  const region = registerData.region || '';
  const school = registerData.schoolName || '';

  const handleBack = () => {
    if (editMode) {
      setEditMode(false);
      navigate('/onboarding/preview');
    } else {
      navigate('/onboarding/character');
    }
  };

  const handleNext = (colorId: string) => {
    setColorId(colorId);
    if (editMode) {
      setEditMode(false);
    }
    navigate('/onboarding/preview');
  };

  return (
    <CardColorSelect
      characterId={data.characterId || ''}
      initialColorId={data.colorId}
      userName={userName}
      userRole={data.nickname}
      region={region}
      school={school}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
};

export default OnboardingColorPageWrapper;
