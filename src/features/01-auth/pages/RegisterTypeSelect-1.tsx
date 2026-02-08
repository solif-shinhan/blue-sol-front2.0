import React from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';
import { ProgressHeader } from '../../../components/ProgressHeader';

import imgShinhanLogo from '../../../assets/images/logo-shinhan-foundation.png';
import imgShinhanText from '../../../assets/images/logo-shinhan-text.svg';
import imgCharacterMiddle from '../../../assets/icons/img-character-middle.png';
import imgCharacterStudent from '../../../assets/icons/img-character-student.png';
import imgCharacterGraduate from '../../../assets/icons/img-character-graduate.png';

type MemberType = 'middle_high' | 'university' | 'graduate';

interface RegisterTypeSelectPageProps {
  onBack?: () => void;
  onSelectType?: (type: MemberType) => void;
  selectedType?: MemberType | null;
}

export const RegisterTypeSelectPage: React.FC<RegisterTypeSelectPageProps> = ({
  onBack,
  onSelectType,
  selectedType,
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${frameSize.width}px`,
    minHeight: `${frameSize.height}px`,
    backgroundColor: colors.white,
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '70px',
    left: 0,
  };

  const titleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '150px',
    left: '16px',
  };

  const titleMediumStyle: React.CSSProperties = {
    ...typography.headingMedium28,
    color: colors.dark,
  };

  const titleLightStyle: React.CSSProperties = {
    ...typography.headingLight28,
    color: colors.dark,
  };

  const cardsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '278px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '360px',
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
      <div style={headerStyle}>
        <ProgressHeader totalSteps={3} currentStep={1} onBack={onBack} />
      </div>

      <div style={titleStyle}>
        <p style={titleMediumStyle}>
          회원 가입 유형<span style={titleLightStyle}>을</span>
        </p>
        <p style={titleLightStyle}>선택해주세요</p>
      </div>

      <div style={cardsContainerStyle}>
        <TypeCard
          title="중학생 및 고등학생"
          subtitle="신한장학재단 장학생"
          image={imgCharacterMiddle}
          isSelected={selectedType === 'middle_high'}
          onClick={() => onSelectType?.('middle_high')}
          imageOverrideStyle={{ top: 'auto', bottom: '0px', transform: 'none', height: '97px', width: '73px' }}
        />
        <TypeCard
          title="대학생 및 대학원생"
          subtitle="신한장학재단 장학생"
          image={imgCharacterStudent}
          isSelected={selectedType === 'university'}
          onClick={() => onSelectType?.('university')}
        />
        <TypeCard
          title="장학재단 졸업생"
          subtitle="대학원생 및 사회인"
          image={imgCharacterGraduate}
          isSelected={selectedType === 'graduate'}
          onClick={() => onSelectType?.('graduate')}
        />
      </div>

      <div style={footerStyle}>
        <img src={imgShinhanLogo} alt="" style={footerLogoStyle} />
        <img src={imgShinhanText} alt="신한장학재단" style={footerTextStyle} />
      </div>
    </div>
  );
};

interface TypeCardProps {
  title: string;
  subtitle: string;
  image: string;
  isSelected?: boolean;
  onClick?: () => void;
  imageOverrideStyle?: React.CSSProperties;
}

const TypeCard: React.FC<TypeCardProps> = ({
  title,
  subtitle,
  image,
  isSelected = false,
  onClick,
  imageOverrideStyle,
}) => {
  const cardStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100px',
    backgroundColor: colors.white,
    borderRadius: '24px',
    boxShadow: '0px 0px 30px 0px rgba(27, 37, 56, 0.1)',
    cursor: 'pointer',
    overflow: 'hidden',
    border: isSelected ? `2px solid ${colors.blueDefault}` : '2px solid transparent',
  };

  const contentStyle: React.CSSProperties = {
    position: 'absolute',
    top: '25px',
    left: '26px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const titleTextStyle: React.CSSProperties = {
    ...typography.headingBold20,
    color: colors.dark,
  };

  const subtitleStyle: React.CSSProperties = {
    ...typography.bodyRegular16,
    color: colors.gray,
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    height: '88px',
    objectFit: 'contain',
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      <div style={contentStyle}>
        <p style={titleTextStyle}>{title}</p>
        <p style={subtitleStyle}>{subtitle}</p>
      </div>
      <img src={image} alt="" style={{ ...imageStyle, ...imageOverrideStyle }} />
    </div>
  );
};

export default RegisterTypeSelectPage;
