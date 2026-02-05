import { useNavigate } from 'react-router-dom';
import { CardComplete } from '@features/02-onboarding';
import { useOnboardingContext } from '@features/02-onboarding/context/OnboardingContext';
import { getInterestsByCategories } from '@features/02-onboarding/api/mock-card-1';

const ONBOARDING_COMPLETE_KEY = 'pureun_sol_onboarding_complete';

const OnboardingCompletePageWrapper = () => {
  const navigate = useNavigate();
  const { data, resetData } = useOnboardingContext();
  const userName = localStorage.getItem('userName') || '';

  // registerData에서 학교 정보 가져오기
  const registerDataStr = localStorage.getItem('registerData');
  const registerData = registerDataStr ? JSON.parse(registerDataStr) : {};
  const region = registerData.region || '';
  const school = registerData.schoolName || '';

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    localStorage.removeItem('registerData'); // 온보딩 완료 시 회원가입 데이터 정리
    resetData();
    navigate('/home');
  };

  return (
    <CardComplete
      characterId={data.characterId || ''}
      colorId={data.colorId || ''}
      userName={userName}
      nickname={data.nickname}
      interests={getInterestsByCategories(data.interests)}
      goals={data.goals}
      region={region}
      school={school}
      onComplete={handleComplete}
    />
  );
};

export default OnboardingCompletePageWrapper;
