import React from 'react';
import { colors, typography } from '../styles/tokens';
import {
  CategoryType,
  categoryIcons,
  categoryLabels,
} from '../assets/icons';

interface CategoryChipProps {
  category?: CategoryType;
  label?: string;
  iconSrc?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  label,
  iconSrc,
  selected = false,
  onClick,
}) => {
  const displayLabel = label || (category ? categoryLabels[category] : '');
  const displayIcon = iconSrc || (category ? categoryIcons[category] : null);

  const wrapperStyle: React.CSSProperties = {
    padding: selected ? '2px' : '0',
    borderRadius: '20px',
    background: selected
      ? 'linear-gradient(90deg, #3971E0 0%, #ABC8FF 100%)'
      : 'transparent',
    cursor: 'pointer',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    height: selected ? '36px' : '40px',
    paddingLeft: '7px',
    paddingRight: '20px',
    borderRadius: '18px',
    border: selected ? 'none' : `1px solid ${colors.lightGray2}`,
    backgroundColor: colors.white,
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    flexShrink: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const iconStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const labelStyle: React.CSSProperties = {
    ...typography.headingSemiBold20,
    color: selected ? '#14307C' : colors.gray,
  };

  return (
    <div style={wrapperStyle} onClick={onClick}>
      <div style={containerStyle}>
        {displayIcon && (
          <div style={iconContainerStyle}>
            <img src={displayIcon} alt={displayLabel} style={iconStyle} />
          </div>
        )}
        <span style={labelStyle}>{displayLabel}</span>
      </div>
    </div>
  );
};

export default CategoryChip;
