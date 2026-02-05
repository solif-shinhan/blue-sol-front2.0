import React from 'react';
import { BackgroundColor } from '../types/card-1';

interface ColorPaletteProps {
  colorList: BackgroundColor[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  colorList,
  selectedId,
  onSelect,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    width: '393px',
    height: '128px',
    padding: '0 20px',
    boxSizing: 'border-box',
    overflowX: 'auto',
    overflowY: 'visible',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const getWrapperStyle = (isSelected: boolean): React.CSSProperties => ({
    flexShrink: 0,
    width: isSelected ? '64px' : '60px',
    height: isSelected ? '124px' : '120px',
    borderRadius: '32px',
    background: isSelected ? 'linear-gradient(180deg, #3971E0 0%, #ABC8FF 100%)' : 'transparent',
    padding: isSelected ? '2px' : '0',
    boxSizing: 'border-box',
  });

  const getItemStyle = (color: BackgroundColor): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    borderRadius: '30px',
    background: color.imageUrl
      ? `url(${color.imageUrl}) center/cover no-repeat`
      : `linear-gradient(180deg, ${color.gradientStart || '#ABC8FF'} 0%, ${color.gradientEnd || '#FFE9E2'} 100%)`,
    border: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  });

  return (
    <div
      style={containerStyle}
      className="color-palette-scroll"
    >
      <style>
        {`.color-palette-scroll::-webkit-scrollbar { display: none; }`}
      </style>
      {colorList.map((color) => {
        const isSelected = selectedId === color.id;
        return (
          <div key={color.id} style={getWrapperStyle(isSelected)}>
            <button
              type="button"
              style={getItemStyle(color)}
              onClick={() => onSelect(color.id)}
              aria-label={color.name}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ColorPalette;
