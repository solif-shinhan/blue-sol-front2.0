import React from 'react';
import { colors, typography } from '../styles/tokens';
import {
  CategoryType,
  categoryIcons,
  categoryLabels,
  categoryIconSizes,
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
    padding: selected ? '0 18px 0 5px' : '0 20px 0 7px',
    borderRadius: '20px',
    border: selected ? 'none' : '1px solid #E6E6E6',
    backgroundColor: '#FFF',
  };

  const iconSize = category ? categoryIconSizes[category] : null;

  const iconContainerStyle: React.CSSProperties = {
    width: iconSize ? `${iconSize.width}px` : '30px',
    height: iconSize ? `${iconSize.height}px` : '30px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const iconStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
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
