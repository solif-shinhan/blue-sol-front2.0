import { useNavigate } from 'react-router-dom';
import { NicknameInput } from '@features/02-onboarding';
import { useOnboardingContext } from '@features/02-onboarding/context/OnboardingContext';

const OnboardingNicknamePageWrapper = () => {
  const navigate = useNavigate();
  const { data, setNickname, editMode, setEditMode } = useOnboardingContext();

  const handleBack = () => {
    if (editMode) {
      setEditMode(false);
      navigate('/onboarding/preview');
    } else {
      navigate('/onboarding/interests');
    }
  };

  const handleNext = (nickname: string) => {
    setNickname(nickname);
    if (editMode) {
      setEditMode(false);
      navigate('/onboarding/preview');
    } else {
      navigate('/onboarding/goals');
    }
  };

  return (
    <NicknameInput
      initialNickname={data.nickname}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
};

export default OnboardingNicknamePageWrapper;
