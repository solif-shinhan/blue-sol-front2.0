import React from 'react';
import { Character } from '../types/card-1';
import { colors } from '../../../styles/tokens';

interface CharacterGridProps {
  characters: Character[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  characters,
  selectedId,
  onSelect,
}) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    width: '100%',
    padding: '0 16px',
    boxSizing: 'border-box',
  };

  const getWrapperStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: isSelected ? '2px' : '0',
    borderRadius: '24px',
    background: isSelected
      ? 'linear-gradient(90deg, #3971E0 0%, #ABC8FF 100%)'
      : 'transparent',
    width: '100%',
    aspectRatio: '1',
    boxSizing: 'border-box',
  });

  const getItemStyle = (isSelected: boolean): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    borderRadius: isSelected ? '22px' : '24px',
    border: 'none',
    backgroundColor: colors.bgWhiteGray,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  });

  const imageStyle: React.CSSProperties = {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
  };

  return (
    <div style={gridStyle}>
      {characters.map((character) => {
        const isSelected = selectedId === character.id;
        return (
          <div key={character.id} style={getWrapperStyle(isSelected)}>
            <button
              type="button"
              style={getItemStyle(isSelected)}
              onClick={() => onSelect(character.id)}
            >
              <img
                src={character.imageUrl}
                alt={character.name}
                style={imageStyle}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default CharacterGrid;
