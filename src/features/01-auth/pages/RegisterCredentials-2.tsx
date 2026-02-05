import React, { useState } from 'react';
import { colors, typography } from '../../../styles/tokens';

export interface IdFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
}

export const IdField: React.FC<IdFieldProps> = ({
  label,
  placeholder = '입력해주세요',
  value,
  onChange,
  errorMessage,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const hasError = !!errorMessage;

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  };

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

  const errorStyle: React.CSSProperties = {
    ...typography.captionRegular12,
    color: colors.pointRed,
    marginLeft: '120px',
  };

  return (
    <div style={wrapperStyle}>
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
          />
        </div>
      </div>
      {hasError && <span style={errorStyle}>{errorMessage}</span>}
    </div>
  );
};

export const validateUserId = (value: string): string | undefined => {
  if (value.length === 0) return undefined;
  if (value.length < 4 || value.length > 20) {
    return '4~20자 이내로 입력해 주세요.';
  }
  return undefined;
};

export const validatePassword = (value: string): string | undefined => {
  if (value.length === 0) return undefined;
  if (value.length < 8 || value.length > 20) {
    return '8~20자 이내로 입력해 주세요.';
  }
  const hasSpecialChar = /[@#$%!]/.test(value);
  if (!hasSpecialChar) {
    return '특수문자(@#$%!)를 하나 이상 포함해 주세요.';
  }
  return undefined;
};
