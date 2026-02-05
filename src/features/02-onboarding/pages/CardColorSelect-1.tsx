import React, { useState, useEffect } from 'react';
import { colors, frameSize } from '../../../styles/tokens';
import { Button } from '../../../components/Button';
import { ProgressHeader } from '../../../components/ProgressHeader';
import { ColorPalette } from '../components/ColorPalette-1';
import { SolidCardPreview } from '../components/SolidCardPreview-1';
import { profileAssetsApi } from '../../../api';
import { Interest, BackgroundColor, Character } from '../types/card-1';

interface CardColorSelectProps {
  characterId: string;
  initialColorId?: string | null;
  userName?: string;
  userRole?: string;
  interests?: Interest[];
  region?: string;
  school?: string;
  schoolName?: string; // deprecated
  onBack?: () => void;
  onNext?: (colorId: string) => void;
}

export const CardColorSelect: React.FC<CardColorSelectProps> = ({
  characterId,
  initialColorId = null,
  userName,
  userRole,
  interests,
  region,
  school,
  schoolName,
  onBack,
  onNext,
}) => {
  const [backgrounds, setBackgrounds] = useState<BackgroundColor[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(initialColorId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const [backgroundsRes, charactersRes] = await Promise.all([
          profileAssetsApi.getBackgrounds(),
          profileAssetsApi.getCharacters(),
        ]);

        if (backgroundsRes.success && backgroundsRes.data) {
          const loadedBackgrounds: BackgroundColor[] = backgroundsRes.data.map((bg, index) => ({
            id: bg.backgroundPattern,
            name: `배경 ${index + 1}`,
            imageUrl: bg.backgroundImageUrl,
          }));
          setBackgrounds(loadedBackgrounds);
          // 초기값이 없으면 첫 번째 배경 선택
          if (!initialColorId && loadedBackgrounds.length > 0) {
            setSelectedColorId(loadedBackgrounds[0].id);
          }
        }

        if (charactersRes.success && charactersRes.data) {
          const foundChar = charactersRes.data.find(c => c.characterPattern === characterId);
          if (foundChar) {
            setCharacter({
              id: foundChar.characterPattern,
              name: '캐릭터',
              imageUrl: foundChar.characterImageUrl,
            });
          }
        }
      } catch (err) {
        console.error('에셋 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [characterId, initialColorId]);

  const selectedColor = backgrounds.find(bg => bg.id === selectedColorId) || null;

  const handleNext = () => {
    if (selectedColorId && onNext) {
      onNext(selectedColorId);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${frameSize.width}px`,
    height: `${frameSize.height}px`,
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const scrollAreaStyle: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
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
    top: '250px',
    transform: 'translateX(-50%)',
  };

  const gradientOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: '409px',
    width: '393px',
    height: '455px',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 17.95%)',
    pointerEvents: 'none',
    zIndex: 5,
  };

  const fixedBottomStyle: React.CSSProperties = {
    flexShrink: 0,
    width: '100%',
    backgroundColor: colors.white,
  };

  const paletteContainerStyle: React.CSSProperties = {
    width: '100%',
    paddingTop: '12px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '20px',
    paddingBottom: '60px',
    width: '100%',
  };

  const buttonInnerStyle: React.CSSProperties = {
    width: '360px',
  };

  return (
    <div style={containerStyle}>
      <div style={scrollAreaStyle} className="hide-scrollbar">
        <div style={headerStyle}>
          <ProgressHeader totalSteps={4} currentStep={4} onBack={onBack} />
        </div>
        <div style={titleContainerStyle}>
          <h1 style={titleStyle}>나만의 SOLID 카드 만들기</h1>
          <p style={subtitleStyle}>카드의 배경색을 골라주세요</p>
        </div>
        <div style={cardContainerStyle}>
          <SolidCardPreview
            character={character}
            backgroundColor={selectedColor}
            userName={userName}
            userRole={userRole}
            interests={interests}
            region={region}
            school={school}
            schoolName={schoolName}
            size="medium"
          />
        </div>
        <div style={gradientOverlayStyle} />
      </div>
      <div style={fixedBottomStyle}>
        <div style={paletteContainerStyle}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>
          ) : (
            <ColorPalette
              colorList={backgrounds}
              selectedId={selectedColorId}
              onSelect={setSelectedColorId}
            />
          )}
        </div>
        <div style={buttonContainerStyle}>
          <div style={buttonInnerStyle}>
            <Button
              variant={selectedColorId ? 'primary' : 'secondary'}
              disabled={!selectedColorId}
              onClick={handleNext}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardColorSelect;
