import { useNavigate } from 'react-router-dom';
import { OnboardingStart } from '@features/02-onboarding';

const OnboardingStartPageWrapper = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/onboarding/interests');
  };

  return <OnboardingStart onStart={handleStart} />;
};

export default OnboardingStartPageWrapper;
