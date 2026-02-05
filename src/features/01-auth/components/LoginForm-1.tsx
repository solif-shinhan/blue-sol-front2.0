import React, { useState } from 'react';
import { colors, typography } from '../../../styles/tokens';

interface LoginFormProps {
  onSubmit?: (id: string, password: string) => void;
  onChange?: (id: string, password: string) => void;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onChange,
  error,
}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<'id' | 'password' | null>(null);

  const handleIdChange = (value: string) => {
    setUserId(value);
    onChange?.(value, password);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    onChange?.(userId, value);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '324px',
  };

  const labelStyle: React.CSSProperties = {
    ...typography.bodyLight18,
    color: colors.dark,
    paddingLeft: '4px',
  };

  const getInputContainerStyle = (field: 'id' | 'password'): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '40px',
    padding: '0 11px',
    borderRadius: '12px',
    border: `1px solid ${focusedField === field ? colors.blueDefault : '#E6E6E6'}`,
    backgroundColor: colors.white,
  });

  const inputStyle: React.CSSProperties = {
    ...typography.bodySemiBold14,
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: colors.dark,
  };

  const placeholderColor = '#848484';

  const errorContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
  };

  const errorTextStyle: React.CSSProperties = {
    ...typography.captionRegular12,
    color: colors.pointRed,
  };

  return (
    <div style={containerStyle}>
      <p style={labelStyle}>로그인</p>
      <div style={getInputContainerStyle('id')}>
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => handleIdChange(e.target.value)}
          onFocus={() => setFocusedField('id')}
          onBlur={() => setFocusedField(null)}
          style={{
            ...inputStyle,
            color: userId ? colors.dark : placeholderColor,
          }}
        />
      </div>
      <div style={getInputContainerStyle('password')}>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          style={{
            ...inputStyle,
            color: password ? colors.dark : placeholderColor,
          }}
        />
      </div>
      {error && (
        <div style={errorContainerStyle}>
          <p style={errorTextStyle}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
