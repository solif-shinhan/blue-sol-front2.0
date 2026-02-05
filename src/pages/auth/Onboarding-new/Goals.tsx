import { useNavigate } from 'react-router-dom';
import { GoalInput } from '@features/02-onboarding';
import { useOnboardingContext } from '@features/02-onboarding/context/OnboardingContext';

const OnboardingGoalsPageWrapper = () => {
  const navigate = useNavigate();
  const { data, setGoals, editMode, setEditMode } = useOnboardingContext();

  const handleBack = () => {
    if (editMode) {
      setEditMode(false);
      navigate('/onboarding/preview');
    } else {
      navigate('/onboarding/nickname');
    }
  };

  const handleNext = (goals: string[]) => {
    setGoals(goals);
    if (editMode) {
      setEditMode(false);
      navigate('/onboarding/preview');
    } else {
      navigate('/onboarding/character');
    }
  };

  return (
    <GoalInput
      initialGoals={data.goals}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
};

export default OnboardingGoalsPageWrapper;
