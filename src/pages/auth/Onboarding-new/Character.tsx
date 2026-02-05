import { useNavigate } from 'react-router-dom';
import { CardCharacterSelect } from '@features/02-onboarding';
import { useOnboardingContext } from '@features/02-onboarding/context/OnboardingContext';

const OnboardingCharacterPageWrapper = () => {
  const navigate = useNavigate();
  const { data, setCharacterId, editMode, setEditMode } = useOnboardingContext();

  const handleBack = () => {
    if (editMode) {
      setEditMode(false);
      navigate('/onboarding/preview');
    } else {
      navigate('/onboarding/goals');
    }
  };

  const handleNext = (characterId: string) => {
    setCharacterId(characterId);
    if (editMode) {
      setEditMode(false);
      navigate('/onboarding/preview');
    } else {
      navigate('/onboarding/color');
    }
  };

  return (
    <CardCharacterSelect
      initialCharacterId={data.characterId}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
};

export default OnboardingCharacterPageWrapper;
