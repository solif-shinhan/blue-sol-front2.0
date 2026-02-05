import React from 'react';
import { colors, typography } from '../styles/tokens';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
}

/**
 * CTA Button Component
 * Figma: Component 4 (805:1846)
 * - primary: #074ED8 (활성)
 * - secondary: #ABC8FF (비활성)
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  fullWidth = true,
}) => {
  const isPrimary = variant === 'primary' && !disabled;

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '360px' : 'auto',
    height: '52px',
    padding: '18px 24px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: isPrimary ? colors.blueDefault : colors.lightBlue,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...typography.ctaBold18,
    color: colors.white,
  };

  return (
    <button style={buttonStyle} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
