import React from 'react';
import { colors, frameSize } from '../styles/tokens';
import { BackArrowIcon } from './Icons';

interface ProgressHeaderProps {
  totalSteps: 2 | 3 | 4;
  currentStep: number;
  onBack?: () => void;
}

/**
 * Progress Header Component
 * Figma: Component 1 (951:3908), Component 5 (964:1506), Component 6 (966:1504)
 * - 뒤로가기 버튼 + 진행 인디케이터
 * - 2단계, 3단계, 4단계 지원
 */
export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  totalSteps,
  currentStep,
  onBack,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: `${frameSize.width}px`,
    height: '40px',
    padding: '0 17px',
  };

  const backButtonStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  };

  const indicatorContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const getIndicatorStyle = (index: number): React.CSSProperties => ({
    width: '34px',
    height: '4px',
    borderRadius: '10px',
    backgroundColor: index < currentStep ? colors.blueDefault : colors.lightGray2,
  });

  return (
    <div style={containerStyle}>
      <button style={backButtonStyle} onClick={onBack}>
        <BackArrowIcon />
      </button>
      <div style={indicatorContainerStyle}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} style={getIndicatorStyle(index)} />
        ))}
      </div>
    </div>
  );
};

export default ProgressHeader;
