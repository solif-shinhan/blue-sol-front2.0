import React, { useState } from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';
import { Button } from '../../../components/Button';
import { ProgressHeader } from '../../../components/ProgressHeader';
import { InputField } from '../../../components/InputField';

interface NicknameInputProps {
  initialNickname?: string;
  onBack?: () => void;
  onNext?: (nickname: string) => void;
}

export const NicknameInput: React.FC<NicknameInputProps> = ({
  initialNickname = '',
  onBack,
  onNext,
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState('');

  const validateNickname = (value: string): boolean => {
    if (value.length < 2) return false;
    if (value.length > 10) return false;
    return true;
  };

  const handleChange = (value: string) => {
    setNickname(value);
    if (error) setError('');
  };

  const handleNext = () => {
    if (!validateNickname(nickname)) {
      setError('사용이 불가한 닉네임입니다.');
      return;
    }
    if (onNext) {
      onNext(nickname);
    }
  };

  const isValid = nickname.length >= 2;

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

  const titleContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '144px',
  };

  const titleStyle: React.CSSProperties = {
    ...typography.headingSemiBold20,
    fontSize: '26px',
    lineHeight: 1.5,
    color: colors.dark,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    ...typography.bodySemiBold14,
    color: '#3971E0',
    marginTop: '12px',
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '17px',
    top: '270px',
  };

  const errorContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '17px',
    top: '340px',
    width: '360px',
    textAlign: 'right',
  };

  const errorStyle: React.CSSProperties = {
    ...typography.bodySemiBold14,
    fontSize: '12px',
    color: '#FF4D4D',
  };

  const buttonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    bottom: '60px',
    width: '360px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <ProgressHeader totalSteps={4} currentStep={2} onBack={onBack} />
      </div>
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>닉네임을 입력해주세요</h1>
        <p style={subtitleStyle}>나를 표현할 수 있는 재밌는 닉네임도 좋아요!</p>
      </div>
      <div style={inputContainerStyle}>
        <InputField
          placeholder="체육교사꿈나무"
          value={nickname}
          onChange={handleChange}
        />
      </div>
      {error && (
        <div style={errorContainerStyle}>
          <span style={errorStyle}>{error}</span>
        </div>
      )}
      <div style={buttonContainerStyle}>
        <Button
          variant={isValid ? 'primary' : 'secondary'}
          disabled={!isValid}
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default NicknameInput;
