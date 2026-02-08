import { useNavigate } from 'react-router-dom';
import { LoginPage } from '@features/01-auth';
import { login as loginApi } from '@/services';
import { getProfile } from '@/services/profileService';

const LoginPageWrapper = () => {
  const navigate = useNavigate();

  const handleLogin = async (id: string, password: string) => {
    try {
      await loginApi({ loginId: id, password });

      // 서버에서 프로필 존재 여부로 온보딩 완료 판단
      try {
        const profileRes = await getProfile();
        if (profileRes.success && profileRes.data) {
          const userId = localStorage.getItem('userId');
          localStorage.setItem(`pureun_sol_onboarding_complete_${userId}`, 'true');
          navigate('/home');
          return;
        }
      } catch {
        // 프로필 API 실패 시 온보딩으로
      }

      navigate('/onboarding');
    } catch {
      throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      onRegister={handleRegister}
    />
  );
};

export default LoginPageWrapper;
