import React, { useState } from 'react';
import { ProgressHeader } from '../../../components/ProgressHeader';
import { Button } from '../../../components/Button';
import { FormField, formatPhoneNumber } from './RegisterScholarInfo-2';
import { SelectField } from './RegisterScholarInfo-3';
import {
  getContainerStyle, headerStyle, titleStyle, titleMediumStyle, titleLightStyle,
  formContainerStyle, formGroupStyle, buttonContainerStyle,
  footerStyle, footerLogoStyle, footerTextStyle,
} from './RegisterScholarInfo-4';
import imgShinhanLogo from '../../../assets/images/logo-shinhan-foundation.png';
import imgShinhanText from '../../../assets/images/logo-shinhan-text.svg';

interface ScholarInfoFormData {
  name: string;
  scholarNumber: string;
  phone: string;
  email: string;
  region: string;
  school: string;
}

type MemberType = 'middle_high' | 'university' | 'graduate';

interface RegisterScholarInfoPageProps {
  onBack?: () => void;
  onNext?: (data: ScholarInfoFormData) => void;
  initialData?: ScholarInfoFormData;
  memberType?: MemberType | null;
}

export const RegisterScholarInfoPage: React.FC<RegisterScholarInfoPageProps> = ({
  onBack,
  onNext,
  initialData,
  memberType,
}) => {
  const isGraduate = memberType === 'graduate';

  const [formData, setFormData] = useState<ScholarInfoFormData>(initialData ?? {
    name: '',
    scholarNumber: '',
    phone: '',
    email: '',
    region: '',
    school: '',
  });

  const isFormValid = isGraduate
    ? formData.name.length > 0 &&
      formData.phone.length > 0 &&
      formData.email.length > 0 &&
      formData.region.length > 0 &&
      formData.school.length > 0
    : Object.values(formData).every((value) => value.length > 0);

  const handleChange = (field: keyof ScholarInfoFormData, value: string) => {
    const formattedValue = field === 'phone' ? formatPhoneNumber(value) : value;
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const handleNext = () => {
    if (isFormValid && onNext) {
      onNext(formData);
    }
  };

  return (
    <div style={getContainerStyle()}>
      <div style={headerStyle}>
        <ProgressHeader totalSteps={3} currentStep={2} onBack={onBack} />
      </div>

      <div style={titleStyle}>
        <p style={titleMediumStyle}>
          장학생 기본 정보<span style={titleLightStyle}>를</span>
        </p>
        <p style={titleLightStyle}>입력해주세요</p>
      </div>

      <div style={formContainerStyle}>
        <div style={formGroupStyle}>
          <FormField
            label="이름"
            placeholder="입력해주세요"
            value={formData.name}
            onChange={(v) => handleChange('name', v)}
          />
          {!isGraduate && (
            <FormField
              label="장학생 번호"
              placeholder="입력해주세요"
              value={formData.scholarNumber}
              onChange={(v) => handleChange('scholarNumber', v)}
            />
          )}
          <FormField
            label="휴대폰 번호"
            placeholder="010-0000-0000"
            value={formData.phone}
            onChange={(v) => handleChange('phone', v)}
            inputMode="tel"
            maxLength={13}
          />
          <FormField
            label="이메일"
            placeholder="입력해주세요"
            value={formData.email}
            onChange={(v) => handleChange('email', v)}
          />
        </div>
        <div style={{ ...formGroupStyle, gap: '16px' }}>
          <SelectField
            label="지역"
            placeholder="입력해주세요"
            value={formData.region}
            onChange={(v) => handleChange('region', v)}
          />
          <FormField
            label={isGraduate ? '직업' : '학교'}
            placeholder="입력해주세요"
            value={formData.school}
            onChange={(v) => handleChange('school', v)}
          />
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <Button
          variant={isFormValid ? 'primary' : 'secondary'}
          disabled={!isFormValid}
          onClick={handleNext}
        >
          다음
        </Button>
      </div>

      <div style={footerStyle}>
        <img src={imgShinhanLogo} alt="" style={footerLogoStyle} />
        <img src={imgShinhanText} alt="신한장학재단" style={footerTextStyle} />
      </div>
    </div>
  );
};

export default RegisterScholarInfoPage;
