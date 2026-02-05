import React, { useState } from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';
import { LoginHeader } from '../components/LoginHeader-1';
import { LoginForm } from '../components/LoginForm-1';

import imgShinhanLogo from '../../../assets/images/logo-shinhan-foundation.png';
import imgShinhanText from '../../../assets/images/logo-shinhan-text.svg';

interface LoginPageProps {
  onLogin?: (id: string, password: string) => void;
  onRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onRegister,
}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  const isFormValid = userId.length > 0 && password.length > 0;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${frameSize.width}px`,
    minHeight: `${frameSize.height}px`,
    backgroundColor: colors.white,
    overflow: 'hidden',
  };

  const formSectionStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '470px',
    width: '324px',
  };

  const buttonSectionStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '650px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '360px',
  };

  const loginButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '52px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: isFormValid ? colors.blueDefault : '#ABC8FF',
    cursor: isFormValid ? 'pointer' : 'not-allowed',
    ...typography.ctaBold18,
    color: colors.white,
  };

  const registerButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '52px',
    borderRadius: '30px',
    border: '1px solid #E6E6E6',
    backgroundColor: '#F3F6FB',
    cursor: 'pointer',
    ...typography.ctaBold18,
    color: colors.dark,
  };

  const footerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '795px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  };

  const footerLogoStyle: React.CSSProperties = {
    width: '22px',
    height: '22px',
    objectFit: 'cover',
  };

  const footerTextStyle: React.CSSProperties = {
    width: '79px',
    height: '13px',
  };

  const handleLogin = () => {
    if (isFormValid && onLogin) {
      onLogin(userId, password);
    }
  };

  const handleFormChange = (id: string, pwd: string) => {
    setUserId(id);
    setPassword(pwd);
    setError(undefined);
  };

  return (
    <div style={containerStyle}>
      <LoginHeader />
      <div style={formSectionStyle}>
        <LoginForm
          onChange={handleFormChange}
          error={error}
        />
      </div>
      <div style={buttonSectionStyle}>
        <button
          style={loginButtonStyle}
          onClick={handleLogin}
          disabled={!isFormValid}
        >
          로그인
        </button>
        <button
          style={registerButtonStyle}
          onClick={onRegister}
        >
          회원가입
        </button>
      </div>
      <div style={footerStyle}>
        <img src={imgShinhanLogo} alt="" style={footerLogoStyle} />
        <img src={imgShinhanText} alt="신한장학재단" style={footerTextStyle} />
      </div>
    </div>
  );
};

export default LoginPage;
