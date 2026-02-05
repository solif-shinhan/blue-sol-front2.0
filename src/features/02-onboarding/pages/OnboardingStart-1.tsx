import React from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';
import { Button } from '../../../components/Button';

import imgTitle from '../../../assets/images/onboarding-title.svg';
import imgBear from '../../../assets/images/character-bear.png';
import imgCat from '../../../assets/images/character-cat.png';
import imgOwl from '../../../assets/images/character-owl.png';
import imgDrop from '../../../assets/images/character-drop.png';
import imgPureun from '../../../assets/images/logo-pureun.svg';
import imgSol from '../../../assets/images/logo-sol.svg';

interface OnboardingStartProps {
  onStart?: () => void;
}

export const OnboardingStart: React.FC<OnboardingStartProps> = ({ onStart }) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${frameSize.width}px`,
    minHeight: `${frameSize.height}px`,
    backgroundColor: colors.white,
    overflow: 'hidden',
  };

  const titleStyle: React.CSSProperties = {
    position: 'absolute',
    left: '98px',
    top: '155px',
    width: '195px',
    height: '71px',
  };

  const charactersContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '57px',
    top: '312px',
    width: '288px',
    height: '195px',
  };

  const bearStyle: React.CSSProperties = {
    position: 'absolute',
    left: '128px',
    top: '0',
    width: '160px',
    height: '195px',
    objectFit: 'cover',
  };

  const catStyle: React.CSSProperties = {
    position: 'absolute',
    left: '0',
    top: '76px',
    width: '98px',
    height: '119px',
    objectFit: 'cover',
  };

  const owlStyle: React.CSSProperties = {
    position: 'absolute',
    left: '77px',
    top: '90px',
    width: '101px',
    height: '105px',
    objectFit: 'cover',
  };

  const dropStyle: React.CSSProperties = {
    position: 'absolute',
    left: '66px',
    top: '18px',
    width: '70px',
    height: '66px',
    objectFit: 'cover',
  };

  const logoContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '611px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  };

  const logoRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5.42px',
  };

  const pureunLogoStyle: React.CSSProperties = {
    width: '33px',
    height: '17px',
  };

  const solLogoStyle: React.CSSProperties = {
    width: '41px',
    height: '17px',
  };

  const subtitleStyle: React.CSSProperties = {
    ...typography.ctaBold18,
    fontSize: '16px',
    lineHeight: 1.4,
    color: colors.lightBlue,
  };

  const buttonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    bottom: '60px',
    width: '360px',
  };

  return (
    <div style={containerStyle}>
      <img src={imgTitle} alt="너와 나, 우리 솔잎들의 꿈을 응원해" style={titleStyle} />
      <div style={charactersContainerStyle}>
        <img src={imgBear} alt="" style={bearStyle} />
        <img src={imgCat} alt="" style={catStyle} />
        <img src={imgOwl} alt="" style={owlStyle} />
        <img src={imgDrop} alt="" style={dropStyle} />
      </div>
      <div style={logoContainerStyle}>
        <div style={logoRowStyle}>
          <img src={imgPureun} alt="푸른" style={pureunLogoStyle} />
          <img src={imgSol} alt="SOL" style={solLogoStyle} />
        </div>
        <span style={subtitleStyle}>솔잎, 성장의 숲으로</span>
      </div>
      <div style={buttonContainerStyle}>
        <Button variant="primary" onClick={onStart}>
          시작하기
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStart;
