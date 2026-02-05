import React, { useState } from 'react';
import { colors, typography } from '../../../styles/tokens';

export interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
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
    position: 'relative',
  };

  const hiddenInputStyle: React.CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    cursor: 'text',
  };

  const placeholderStyle: React.CSSProperties = {
    ...typography.bodySemiBold14,
    color: colors.gray,
  };

  const dotsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    height: '10px',
  };

  const dotStyle: React.CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: colors.dark,
  };

  const caretStyle: React.CSSProperties = {
    width: '1px',
    height: '16px',
    backgroundColor: '#0046FF',
    marginLeft: hasValue ? '3px' : '0',
    animation: 'blink 1s step-end infinite',
  };

  const errorStyle: React.CSSProperties = {
    ...typography.captionRegular12,
    color: colors.pointRed,
    marginLeft: '120px',
  };

  const renderDots = () => {
    const dots = [];
    const displayCount = Math.min(value.length, 10);
    for (let i = 0; i < displayCount; i++) {
      dots.push(<div key={i} style={dotStyle} />);
    }
    return dots;
  };

  return (
    <div style={wrapperStyle}>
      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      <div style={containerStyle}>
        <span style={labelStyle}>{label}</span>
        <div style={inputContainerStyle}>
          <input
            type="password"
            style={hiddenInputStyle}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
          />
          {!hasValue && !isFocused && (
            <span style={placeholderStyle}>{placeholder}</span>
          )}
          {(hasValue || isFocused) && (
            <div style={dotsContainerStyle}>
              {renderDots()}
              {isFocused && <div style={caretStyle} />}
            </div>
          )}
        </div>
      </div>
      {hasError && <span style={errorStyle}>{errorMessage}</span>}
    </div>
  );
};
