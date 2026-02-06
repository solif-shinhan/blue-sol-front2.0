import React, { useState, useEffect } from 'react';
import { colors, frameSize } from '../../../styles/tokens';
import { Button } from '../../../components/Button';
import { ProgressHeader } from '../../../components/ProgressHeader';
import { SolidCardPreview } from '../components/SolidCardPreview-1';
import { profileAssetsApi } from '../../../api';
import { EditModal, EditTarget } from './CardPreview-2';
import { Interest, BackgroundColor, Character, CardTheme, DARK_PATTERNS } from '../types/card-1';

export type { EditTarget } from './CardPreview-2';

interface CardPreviewProps {
  characterId: string;
  colorId: string;
  userName?: string;
  nickname: string;
  interests?: Interest[];
  goals?: string[];
  region?: string;
  school?: string;
  sinceYear?: string;
  onBack?: () => void;
  onEdit?: (target: EditTarget) => void;
  onNext?: () => void;
}

// region과 school을 별도로 전달하기 위해 인터페이스 유지

export const CardPreview: React.FC<CardPreviewProps> = ({
  characterId,
  colorId,
  userName = '김신한',
  nickname,
  interests = [],
  goals = [],
  region = '',
  school = '',
  sinceYear = '2026',
  onBack,
  onEdit,
  onNext,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
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

  const handleCardClick = () => {
    setShowEditModal(true);
  };

  const handleEditOption = (target: EditTarget) => {
    setShowEditModal(false);
    if (onEdit) onEdit(target);
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
    width: '100%',
    zIndex: 10,
  };

  const titleContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '144px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 10,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: '"OneShinhan", sans-serif',
    fontWeight: 500,
    fontSize: '28px',
    lineHeight: 1.4,
    letterSpacing: '-0.56px',
    color: colors.dark,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: '"Pretendard", sans-serif',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: 1.2,
    color: '#3971E0',
    margin: 0,
  };

  const cardContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: 'calc(50% + 49px)',
    transform: 'translate(-50%, -50%) scale(0.9)',
  };

  const buttonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: '60px',
    width: '360px',
    zIndex: 10,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <ProgressHeader totalSteps={4} currentStep={4} onBack={onBack} />
      </div>
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>나만의 SOLID 카드 만들기</h1>
        <p style={subtitleStyle}>수정할 부분이 있으면 탭하여 수정해주세요</p>
      </div>
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
          onClick={handleCardClick}
        />
      </div>
      <div style={buttonContainerStyle}>
        <Button variant="primary" onClick={onNext}>
          다음
        </Button>
      </div>

      {showEditModal && (
        <EditModal
          onClose={() => setShowEditModal(false)}
          onSelectOption={handleEditOption}
        />
      )}
    </div>
  );
};

export default CardPreview;
