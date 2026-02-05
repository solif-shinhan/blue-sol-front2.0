import React from 'react';
import { colors, typography } from '../../../styles/tokens';

export interface FormFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  maxLength?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder = '입력해주세요',
  value,
  onChange,
  inputMode = 'text',
  maxLength,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const hasValue = value.length > 0;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '40px',
  };

  const labelStyle: React.CSSProperties = {
    ...typography.bodySemiBold16,
    color: colors.dark,
  };

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '240px',
    height: '40px',
    padding: '0 11px',
    borderRadius: '12px',
    border: `1px solid ${isFocused || hasValue ? colors.blueDefault : colors.lightGray2}`,
    backgroundColor: colors.white,
  };

  const inputStyle: React.CSSProperties = {
    ...(hasValue ? typography.bodyBold16 : typography.bodySemiBold14),
    color: hasValue ? colors.dark : colors.gray,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>{label}</span>
      <div style={inputContainerStyle}>
        <input
          type="text"
          style={inputStyle}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          inputMode={inputMode}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
};

export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};
