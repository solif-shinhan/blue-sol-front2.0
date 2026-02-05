import { useNavigate } from 'react-router-dom';
import { CardPreview } from '@features/02-onboarding';
import { useOnboardingContext, EditTarget } from '@features/02-onboarding/context/OnboardingContext';
import { getInterestsByCategories } from '@features/02-onboarding/api/mock-card-1';

const OnboardingPreviewPageWrapper = () => {
  const navigate = useNavigate();
  const { data, setEditMode } = useOnboardingContext();
  const userName = localStorage.getItem('userName') || '';

  // registerData에서 학교 정보 가져오기
  const registerDataStr = localStorage.getItem('registerData');
  const registerData = registerDataStr ? JSON.parse(registerDataStr) : {};
  const region = registerData.region || '';
  const school = registerData.schoolName || '';

  const handleBack = () => {
    navigate('/onboarding/color');
  };

  const handleEdit = (target: EditTarget) => {
    setEditMode(true);
    switch (target) {
      case 'interests':
        navigate('/onboarding/interests');
        break;
      case 'nickname':
        navigate('/onboarding/nickname');
        break;
      case 'goals':
        navigate('/onboarding/goals');
        break;
      case 'character':
        navigate('/onboarding/character');
        break;
      case 'color':
        navigate('/onboarding/color');
        break;
    }
  };

  const handleNext = () => {
    navigate('/onboarding/complete');
  };

  return (
    <CardPreview
      characterId={data.characterId || ''}
      colorId={data.colorId || ''}
      userName={userName}
      nickname={data.nickname}
      interests={getInterestsByCategories(data.interests)}
      goals={data.goals}
      region={region}
      school={school}
      onBack={handleBack}
      onEdit={handleEdit}
      onNext={handleNext}
    />
  );
};

export default OnboardingPreviewPageWrapper;
