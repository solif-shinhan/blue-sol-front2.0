import React, { useState } from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';
import { ProgressHeader } from '../../../components/ProgressHeader';
import { Button } from '../../../components/Button';
import imgShinhanLogo from '../../../assets/images/logo-shinhan-foundation.png';
import imgShinhanText from '../../../assets/images/logo-shinhan-text.svg';
import { IdField, validateUserId, validatePassword } from './RegisterCredentials-2';
import { PasswordField } from './RegisterCredentials-3';

interface CredentialsFormData {
  userId: string;
  password: string;
  passwordConfirm: string;
}

interface RegisterCredentialsPageProps {
  onBack?: () => void;
  onSubmit?: (data: CredentialsFormData) => void;
  initialData?: CredentialsFormData;
}

export const RegisterCredentialsPage: React.FC<RegisterCredentialsPageProps> = ({
  onBack,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<CredentialsFormData>(initialData ?? {
    userId: '',
    password: '',
    passwordConfirm: '',
  });

  const userIdError = validateUserId(formData.userId);
  const passwordError = validatePassword(formData.password);
  const passwordConfirmError = validatePassword(formData.passwordConfirm);

  const isFormValid =
    formData.userId.length >= 4 &&
    formData.userId.length <= 20 &&
    formData.password.length >= 8 &&
    formData.password.length <= 20 &&
    /[@#$%!]/.test(formData.password) &&
    formData.password === formData.passwordConfirm;

  const handleChange = (field: keyof CredentialsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (isFormValid && onSubmit) {
      onSubmit(formData);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${frameSize.width}px`,
    minHeight: `${frameSize.height}px`,
    backgroundColor: colors.white,
    overflow: 'visible',
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

  const formContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '278px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    width: '360px',
    zIndex: 10,
  };

  const formGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
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
        <ProgressHeader totalSteps={3} currentStep={3} onBack={onBack} />
      </div>

      <div style={titleStyle}>
        <p style={titleMediumStyle}>
          아이디와 비밀번호<span style={titleLightStyle}>를</span>
        </p>
        <p style={titleLightStyle}>설정해주세요</p>
      </div>

      <div style={formContainerStyle}>
        <IdField
          label="아이디"
          placeholder="입력해주세요"
          value={formData.userId}
          onChange={(v) => handleChange('userId', v)}
          errorMessage={userIdError}
        />
        <div style={formGroupStyle}>
          <PasswordField
            label="비밀번호"
            placeholder="입력해주세요"
            value={formData.password}
            onChange={(v) => handleChange('password', v)}
            errorMessage={passwordError}
          />
          <PasswordField
            label="비밀번호 확인"
            placeholder="입력해주세요"
            value={formData.passwordConfirm}
            onChange={(v) => handleChange('passwordConfirm', v)}
            errorMessage={passwordConfirmError}
          />
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <Button
          variant={isFormValid ? 'primary' : 'secondary'}
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          가입 및 로그인
        </Button>
      </div>

      <div style={footerStyle}>
        <img src={imgShinhanLogo} alt="" style={footerLogoStyle} />
        <img src={imgShinhanText} alt="신한장학재단" style={footerTextStyle} />
      </div>
    </div>
  );
};

export default RegisterCredentialsPage;
