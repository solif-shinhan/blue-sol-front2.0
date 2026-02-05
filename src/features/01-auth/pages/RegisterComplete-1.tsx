import React, { useEffect } from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';

import imgShinhanLogo from '../../../assets/images/logo-shinhan-foundation.png';
import imgShinhanText from '../../../assets/images/logo-shinhan-text.svg';
import imgWelcomeCharacter from '../../../assets/images/welcome-character.png';

interface RegisterCompleteProps {
  userName?: string;
  onContinue?: () => void;
  autoNavigateDelay?: number;
}

export const RegisterComplete: React.FC<RegisterCompleteProps> = ({
  userName = '김신한',
  onContinue,
  autoNavigateDelay = 3000,
}) => {
  useEffect(() => {
    if (onContinue && autoNavigateDelay > 0) {
      const timer = setTimeout(onContinue, autoNavigateDelay);
      return () => clearTimeout(timer);
    }
  }, [onContinue, autoNavigateDelay]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${frameSize.width}px`,
    minHeight: `${frameSize.height}px`,
    backgroundColor: colors.white,
    overflow: 'hidden',
  };

  const characterStyle: React.CSSProperties = {
    position: 'absolute',
    left: '116px',
    top: '271px',
    width: '161px',
    height: '190px',
    objectFit: 'contain',
  };

  const subtitleStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '500px',
    ...typography.headingSemiBold20,
    color: colors.gray,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  };

  const welcomeTextStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '540px',
    ...typography.headingMedium28,
    color: colors.blueDefault,
    textAlign: 'center',
    whiteSpace: 'nowrap',
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

  return (
    <div style={containerStyle}>
      <img
        src={imgWelcomeCharacter}
        alt=""
        style={characterStyle}
      />
      <p style={subtitleStyle}>회원가입이 완료되었습니다</p>
      <p style={welcomeTextStyle}>{userName}님, 환영해요!</p>
      <div style={footerStyle}>
        <img src={imgShinhanLogo} alt="" style={footerLogoStyle} />
        <img src={imgShinhanText} alt="신한장학재단" style={footerTextStyle} />
      </div>
    </div>
  );
};

export default RegisterComplete;
