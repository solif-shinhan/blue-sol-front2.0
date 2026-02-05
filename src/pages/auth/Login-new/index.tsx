import { useNavigate } from 'react-router-dom';
import { LoginPage } from '@features/01-auth';
import { login as loginApi } from '@/services';

const ONBOARDING_COMPLETE_KEY = 'pureun_sol_onboarding_complete';

const LoginPageWrapper = () => {
  const navigate = useNavigate();

  const checkOnboardingComplete = (): boolean => {
    return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
  };

  const handleLogin = async (id: string, password: string) => {
    try {
      await loginApi({ loginId: id, password });
      if (checkOnboardingComplete()) {
        navigate('/home');
      } else {
        navigate('/onboarding');
      }
    } catch {
      console.error('Login failed');
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
