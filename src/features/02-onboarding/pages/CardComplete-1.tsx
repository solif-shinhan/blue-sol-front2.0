import React, { useState, useEffect } from 'react';
import { colors, frameSize } from '../../../styles/tokens';
import { Button } from '../../../components/Button';
import { SolidCardPreview } from '../components/SolidCardPreview-1';
import { profileAssetsApi } from '../../../api';
import { Interest, BackgroundColor, Character, CardTheme, DARK_PATTERNS } from '../types/card-1';

interface CardCompleteProps {
  characterId: string;
  colorId: string;
  userName?: string;
  nickname: string;
  interests?: Interest[];
  goals?: string[];
  region?: string;
  school?: string;
  sinceYear?: string;
  onComplete?: () => void;
}

export const CardComplete: React.FC<CardCompleteProps> = ({
  characterId,
  colorId,
  userName = '김신한',
  nickname,
  interests = [],
  goals = [],
  region = '',
  school = '',
  sinceYear = '2026',
  onComplete,
}) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<BackgroundColor | null>(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const [backgroundsRes, charactersRes] = await Promise.all([
          profileAssetsApi.getBackgrounds(),
          profileAssetsApi.getCharacters(),
        ]);
        if (backgroundsRes.success && backgroundsRes.data && colorId) {
          const found = backgroundsRes.data.find(bg => bg.backgroundPattern === colorId);
          if (found) {
            setBackgroundColor({
              id: found.backgroundPattern,
              name: '배경',
              imageUrl: found.backgroundImageUrl,
              theme: (DARK_PATTERNS.has(found.backgroundPattern) ? 'dark' : 'light') as CardTheme,
            });
          }
        }
        if (charactersRes.success && charactersRes.data && characterId) {
          const found = charactersRes.data.find(c => c.characterPattern === characterId);
          if (found) {
            setCharacter({ id: found.characterPattern, name: '캐릭터', imageUrl: found.characterImageUrl });
          }
        }
      } catch (err) {
        console.error('에셋 로드 실패:', err);
      }
    };
    loadAssets();
  }, [characterId, colorId]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${frameSize.width}px`,
    minHeight: `${frameSize.height}px`,
    backgroundColor: colors.white,
    overflow: 'hidden',
  };

  const titleStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '108px',
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: 1.2,
    color: '#14307C',
    opacity: 0.5,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    margin: 0,
  };

  const cardContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    marginTop: '6px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: '60px',
    width: '360px',
  };

  return (
    <div style={containerStyle}>
      <p style={titleStyle}>세상에 하나뿐인 나의 SOLID가 완성되었어요</p>
      <div style={cardContainerStyle}>
        <SolidCardPreview
          character={character}
          backgroundColor={backgroundColor}
          userName={userName}
          userRole={nickname}
          interests={interests}
          goals={goals}
          region={region}
          school={school}
          sinceYear={sinceYear}
          size="complete"
        />
      </div>
      <div style={buttonContainerStyle}>
        <Button variant="primary" onClick={onComplete}>
          홈으로 이동
        </Button>
      </div>
    </div>
  );
};

export default CardComplete;
