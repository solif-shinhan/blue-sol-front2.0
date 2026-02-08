import { useNavigate } from 'react-router-dom';
import { InterestSelection } from '@features/02-onboarding';
import { useOnboardingContext } from '@features/02-onboarding/context/OnboardingContext';
import { CategoryType } from '@/assets/icons';

const OnboardingInterestsPageWrapper = () => {
  const navigate = useNavigate();
  const { data, setInterests, editMode, setEditMode } = useOnboardingContext();

  const handleBack = () => {
    if (editMode) {
      setEditMode(false);
      navigate('/onboarding/preview');
    } else {
      navigate('/onboarding');
    }
  };

  const handleNext = (categories: CategoryType[]) => {
    setInterests(categories);
    if (editMode) {
      setEditMode(false);
      navigate('/onboarding/preview');
    } else {
      navigate('/onboarding/nickname');
    }
  };

  return (
    <InterestSelection
      initialInterests={data.interests}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
};

export default OnboardingInterestsPageWrapper;
