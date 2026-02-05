import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterCredentialsPage } from '@features/01-auth';
import { signup, login, type UserRole } from '@/services/authService';
import type { MemberType } from './index';

interface CredentialsFormData {
  userId: string;
  password: string;
  passwordConfirm: string;
}

interface ScholarInfoFormData {
  name: string;
  scholarNumber: string;
  phone: string;
  email: string;
  region: string;
  school: string;
}

const RegisterCredentialsPageWrapper = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const savedData = sessionStorage.getItem('register_credentials');
  const initialData: CredentialsFormData = savedData
    ? JSON.parse(savedData)
    : { userId: '', password: '', passwordConfirm: '' };

  const handleBack = () => {
    navigate('/register/scholarship');
  };

  const handleSubmit = async (data: CredentialsFormData) => {
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      // 이전 단계에서 저장한 정보 가져오기
      const scholarInfoStr = sessionStorage.getItem('register_scholar_info');
      const memberType = sessionStorage.getItem('register_member_type') as MemberType | null;

      console.log('[Credentials] scholarInfoStr:', scholarInfoStr);
      console.log('[Credentials] memberType:', memberType);

      if (!scholarInfoStr) {
        setError('회원 정보가 없습니다. 처음부터 다시 시도해주세요.');
        setIsLoading(false);
        return;
      }

      const scholarInfo: ScholarInfoFormData = JSON.parse(scholarInfoStr);

      // userRole 결정 (middle_high -> JUNIOR, university -> SENIOR, graduate -> GRADUATE)
      let userRole: UserRole = 'SENIOR';
      if (memberType === 'middle_high') {
        userRole = 'JUNIOR';
      } else if (memberType === 'university') {
        userRole = 'SENIOR';
      } else if (memberType === 'graduate') {
        userRole = 'GRADUATE';
      }

      const signupPayload = {
        loginId: data.userId,
        password: data.password,
        name: scholarInfo.name,
        phone: scholarInfo.phone,
        email: scholarInfo.email,
        userRole: userRole,
        // 빈 문자열은 undefined로 처리
        ...(scholarInfo.scholarNumber ? { scholarNumber: scholarInfo.scholarNumber } : {}),
        ...(scholarInfo.region ? { region: scholarInfo.region } : {}),
        ...(scholarInfo.school ? { schoolName: scholarInfo.school } : {}),
        // GRADUATE인 경우 job 필드 필요 (임시로 기본값 설정)
        ...(userRole === 'GRADUATE' ? { job: '졸업생' } : {}),
      };

      console.log('[Credentials] signup payload:', { ...signupPayload, password: '***' });

      // 회원가입 API 호출
      const signupResponse = await signup(signupPayload);
      console.log('[Credentials] signup response:', signupResponse);

      if (signupResponse.success) {
        // 로그인 API 호출
        const loginResponse = await login({
          loginId: data.userId,
          password: data.password,
        });
        console.log('[Credentials] login response:', loginResponse);

        // userName을 저장 (온보딩에서 사용)
        localStorage.setItem('userName', scholarInfo.name);

        // 세션 스토리지에 credentials 저장 (Complete 페이지에서 필요할 수 있음)
        sessionStorage.setItem('register_credentials', JSON.stringify(data));

        // 성공 시 complete 페이지로 이동
        navigate('/register/complete');
      } else {
        setError(signupResponse.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error('[Credentials] error:', err);
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RegisterCredentialsPage
        onBack={handleBack}
        onSubmit={handleSubmit}
        initialData={initialData}
      />
      {error && (
        <div style={{
          position: 'fixed',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ff4444',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 1000,
        }}>
          {error}
        </div>
      )}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px 40px',
            borderRadius: '12px',
            fontSize: '16px',
          }}>
            처리 중...
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterCredentialsPageWrapper;
