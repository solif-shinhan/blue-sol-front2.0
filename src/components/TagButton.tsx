import React from 'react';
import { colors, typography } from '../styles/tokens';

type TagButtonVariant = 'icon-only' | 'text-only' | 'icon-text';

interface TagButtonProps {
  variant?: TagButtonVariant;
  label?: string;
  selected?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
}

/**
 * Tag Button Component
 * Figma: Component 14 (823:3508)
 * - icon-only: + 버튼 (40x40)
 * - text-only: 주제 제안하기
 * - icon-text: 스터디 (선택 상태 포함)
 */
export const TagButton: React.FC<TagButtonProps> = ({
  variant = 'icon-only',
  label,
  selected = false,
  leftIcon,
  rightIcon,
  onClick,
}) => {
  const getContainerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      borderRadius: '30px',
      border: `1px solid ${selected ? colors.blueDefault : colors.lightGray2}`,
      backgroundColor: colors.white,
      cursor: 'pointer',
    };

    switch (variant) {
      case 'icon-only':
        return {
          ...baseStyle,
          justifyContent: 'center',
          width: '40px',
          height: '40px',
        };
      case 'text-only':
        return {
          ...baseStyle,
          gap: '10px',
          height: '40px',
          padding: '0 10px',
        };
      case 'icon-text':
        return {
          ...baseStyle,
          gap: '10px',
          height: '40px',
          paddingLeft: '7px',
          paddingRight: '10px',
        };
      default:
        return baseStyle;
    }
  };

  const iconStyle: React.CSSProperties = {
    width: variant === 'icon-only' ? '20px' : '28px',
    height: variant === 'icon-only' ? '20px' : '28px',
    flexShrink: 0,
  };

  const labelStyle: React.CSSProperties = {
    ...typography.headingSemiBold20,
    color: selected ? colors.blueDefault : colors.gray,
  };

  return (
    <div style={getContainerStyle()} onClick={onClick}>
      {leftIcon && <div style={iconStyle}>{leftIcon}</div>}
      {label && <span style={labelStyle}>{label}</span>}
      {rightIcon && <div style={iconStyle}>{rightIcon}</div>}
    </div>
  );
};

export default TagButton;
