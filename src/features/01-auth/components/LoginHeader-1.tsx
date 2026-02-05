import React from 'react';
import { colors, typography } from '../../../styles/tokens';

import imgCharacters from '../../../assets/images/login-characters.png';
import imgPureun from '../../../assets/images/logo-pureun.svg';
import imgSol from '../../../assets/images/logo-sol.svg';

interface LoginHeaderProps {
  backgroundImage?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  backgroundImage = imgCharacters,
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '440px',
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '393px',
    height: '440px',
    overflow: 'visible',
    pointerEvents: 'none',
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    width: '110.2%',
    height: '130.45%',
    left: '-3.83%',
    top: '-20.68%',
    maxWidth: 'none',
  };

  const gradientOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '117px',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0), #FFFFFF)',
  };

  const brandingContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '38px',
    top: '337px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  };

  const sloganStyle: React.CSSProperties = {
    ...typography.bodyLight18,
    color: colors.dark,
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
  };

  const pureunLogoStyle: React.CSSProperties = {
    width: '56px',
    height: '28px',
  };

  const solLogoStyle: React.CSSProperties = {
    width: '70px',
    height: '29px',
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}>
        <img src={backgroundImage} alt="" style={imageStyle} />
      </div>
      <div style={gradientOverlayStyle} />
      <div style={brandingContainerStyle}>
        <p style={sloganStyle}>너와 나, 우리 솔잎들의 꿈을 응원해</p>
        <div style={logoContainerStyle}>
          <img src={imgPureun} alt="푸른" style={pureunLogoStyle} />
          <img src={imgSol} alt="SOL" style={solLogoStyle} />
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;
