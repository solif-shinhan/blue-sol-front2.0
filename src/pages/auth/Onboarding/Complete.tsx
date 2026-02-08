import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardComplete } from '@features/02-onboarding';
import { useOnboardingContext } from '@features/02-onboarding/context/OnboardingContext';
import { getInterestsByCategories } from '@features/02-onboarding/api/mock-card-1';
import { createProfile, registerInterests } from '@/services/profileService';
import { categoryLabels } from '@/assets/icons';

const OnboardingCompletePageWrapper = () => {
  const navigate = useNavigate();
  const { data, resetData } = useOnboardingContext();
  const [isSaving, setIsSaving] = useState(false);
  const userName = localStorage.getItem('userName') || '';

  // registerData에서 학교 정보 가져오기
  const registerDataStr = localStorage.getItem('registerData');
  const registerData = registerDataStr ? JSON.parse(registerDataStr) : {};
  const region = registerData.region || '';
  const school = registerData.schoolName || '';

  const handleComplete = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // 프로필 생성 API 호출
      const profileRes = await createProfile({
        mainGoals: data.goals,
        solidGoalName: data.nickname,
        userCharacter: data.characterId || '',
        backgroundPattern: data.colorId || '',
      });

      if (!profileRes.success) {
        console.error('프로필 생성 실패:', profileRes.message);
      }

      // 관심사 등록 API 호출 (CategoryType → 한글 카테고리명 변환)
      if (data.interests.length > 0) {
        const koreanNames = data.interests.map((cat) => categoryLabels[cat]);
        await registerInterests(koreanNames).catch((err) => {
          console.error('관심사 등록 실패:', err);
        });
      }
    } catch (error) {
      console.error('프로필 저장 실패:', error);
    }

    const userId = localStorage.getItem('userId');
    localStorage.setItem(`pureun_sol_onboarding_complete_${userId}`, 'true');
    localStorage.removeItem('registerData');
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
