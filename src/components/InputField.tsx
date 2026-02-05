import React from 'react';
import { colors, typography } from '../styles/tokens';

// + 버튼 아이콘 SVG
const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.66026 20V11.2949H0V8.66026H8.66026V0H11.2949V8.66026H20V11.2949H11.2949V20H8.66026Z"
      fill="#A6A6A6"
    />
  </svg>
);

interface InputFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Input Field Component
 * Figma: Component 16 (823:3696)
 * - 입력 필드 (60px height, 24px border-radius)
 */
export const InputField: React.FC<InputFieldProps> = ({
  placeholder = '목표를 입력해주세요',
  value,
  onChange,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '360px',
    height: '60px',
    padding: '13px 20px',
    borderRadius: '24px',
    border: `1px solid ${colors.lightGray2}`,
    backgroundColor: colors.white,
  };

  const inputStyle: React.CSSProperties = {
    ...typography.headingSemiBold20,
    color: value ? colors.dark : colors.gray,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

interface InputWithAddProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onAdd?: () => void;
}

/**
 * Input With Add Button Component
 * Figma: Component 16 (823:3696)
 * - 입력 필드 + 추가 버튼
 */
export const InputWithAdd: React.FC<InputWithAddProps> = ({
  placeholder = '목표를 입력해주세요',
  value,
  onChange,
  onAdd,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '360px',
  };

  const addButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: `1px solid ${colors.lightGray2}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <InputField
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button style={addButtonStyle} onClick={onAdd}>
        <PlusIcon />
      </button>
    </div>
  );
};

export default InputField;
