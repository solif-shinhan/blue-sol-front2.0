import React, { useState, useEffect } from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';
import { Button } from '../../../components/Button';
import { ProgressHeader } from '../../../components/ProgressHeader';
import { CharacterGrid } from '../components/CharacterGrid-1';
import { profileAssetsApi } from '../../../api';
import { Character } from '../types/card-1';

interface CardCharacterSelectProps {
  initialCharacterId?: string | null;
  onBack?: () => void;
  onNext?: (characterId: string) => void;
}

export const CardCharacterSelect: React.FC<CardCharacterSelectProps> = ({
  initialCharacterId = null,
  onBack,
  onNext,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(initialCharacterId);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setError(null);
        const response = await profileAssetsApi.getCharacters();
        console.log('[CardCharacterSelect] API 응답:', response);
        if (response.success && response.data && response.data.length > 0) {
          const loadedCharacters: Character[] = response.data.map((char, index) => ({
            id: char.characterPattern,
            name: `캐릭터 ${index + 1}`,
            imageUrl: char.characterImageUrl,
          }));
          setCharacters(loadedCharacters);
        } else {
          setError('캐릭터 데이터가 없습니다.');
        }
      } catch (err) {
        console.error('캐릭터 로드 실패:', err);
        setError(err instanceof Error ? err.message : '캐릭터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  const handleNext = () => {
    if (selectedId && onNext) {
      onNext(selectedId);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${frameSize.width}px`,
    minHeight: `${frameSize.height}px`,
    backgroundColor: colors.white,
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '70px',
    left: 0,
  };

  const titleContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '144px',
  };

  const titleStyle: React.CSSProperties = {
    ...typography.headingSemiBold20,
    fontSize: '26px',
    lineHeight: 1.5,
    color: colors.dark,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    ...typography.bodySemiBold14,
    color: '#3971E0',
    marginTop: '12px',
  };

  const gridContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: '270px',
    width: '100%',
    maxHeight: '420px',
    overflowY: 'auto',
  };

  const buttonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    bottom: '60px',
    width: '360px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <ProgressHeader totalSteps={4} currentStep={4} onBack={onBack} />
      </div>
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>나만의 SOLID 카드 만들기</h1>
        <p style={subtitleStyle}>나를 표현할 프로필 캐릭터를 골라주세요</p>
      </div>
      <div style={gridContainerStyle}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>캐릭터 로딩 중...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>
            {error}
          </div>
        ) : characters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>캐릭터가 없습니다.</div>
        ) : (
          <CharacterGrid
            characters={characters}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </div>
      <div style={buttonContainerStyle}>
        <Button
          variant={selectedId ? 'primary' : 'secondary'}
          disabled={!selectedId}
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default CardCharacterSelect;
