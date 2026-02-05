import React from 'react';
import { Character, BackgroundColor, Interest, CardTheme } from '../types/card-1';
import {
  getCardStyle,
  getLogoStyle,
  getUserInfoStyle,
  getNameStyle,
  getRoleStyle,
  getCharacterStyle,
  getTagsContainerStyle,
  getTagStyle,
  getTagIconStyle,
  getTagTextStyle,
  cardDimensions,
} from './SolidCardPreview-2';
import {
  getMoreTagStyle,
  getDotsStyle,
  getDotStyle,
  getGoalsContainerStyle,
  getGoalStyle,
  getFooterStyle,
  getSchoolStyle,
  getSinceStyle,
} from './SolidCardPreview-3';

// 이미지 배경 컴포넌트
const CardBackgroundImage: React.FC<{
  size: 'small' | 'medium' | 'large' | 'complete';
  imageUrl: string;
}> = ({ size, imageUrl }) => {
  const { width, topHeight } = cardDimensions[size];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${topHeight}px`,
        borderRadius: size === 'small' ? '28px 28px 0 30px' : size === 'medium' ? '30px 30px 0 30px' : '40px 40px 0 38px',
        background: `url(${imageUrl}) center/cover no-repeat`,
        overflow: 'hidden',
      }}
    />
  );
};

// Figma SVG 배경 컴포넌트 (노드 1773:38493)
const CardBackgroundSvg: React.FC<{
  size: 'small' | 'medium' | 'large' | 'complete';
  gradientStart: string;
  gradientEnd: string;
}> = ({ size, gradientStart, gradientEnd }) => {
  const { width, topHeight } = cardDimensions[size];
  const gradientId = `cardGradient_${size}_${Math.random().toString(36).substr(2, 9)}`;

  // large 사이즈 기준 (350x294)
  const baseWidth = 350;
  const baseHeight = 293.788;

  return (
    <svg
      preserveAspectRatio="none"
      width={width}
      height={topHeight}
      overflow="visible"
      style={{
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      viewBox={`0 0 ${baseWidth} ${baseHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 50.9091C0 33.0892 0 24.1793 3.46797 17.373C6.51849 11.3861 11.3861 6.51849 17.373 3.46797C24.1793 0 33.0892 0 50.9091 0H299.091C316.911 0 325.821 0 332.627 3.46797C338.614 6.51849 343.482 11.3861 346.532 17.373C350 24.1793 350 33.0892 350 50.9091V293.788H54.303C35.2952 293.788 25.7913 293.788 18.5312 290.089C12.1451 286.835 6.95306 281.643 3.69917 275.257C0 267.997 0 258.493 0 239.485V50.9091Z"
        fill={`url(#${gradientId})`}
        fillOpacity="0.8"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1={baseWidth / 2}
          y1="0"
          x2={baseWidth / 2}
          y2={baseHeight}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={gradientStart.replace('rgba(', '').split(',')[0] === 'rgba(' ? gradientStart : gradientStart} />
          <stop offset="1" stopColor={gradientEnd} />
        </linearGradient>
      </defs>
    </svg>
  );
};

interface SolidCardPreviewProps {
  character: Character | null;
  backgroundColor: BackgroundColor | null;
  userName?: string;
  userRole?: string;
  interests?: Interest[];
  goals?: string[];
  region?: string;
  school?: string;
  schoolName?: string; // deprecated, use region + school instead
  sinceYear?: string;
  size?: 'small' | 'medium' | 'large' | 'complete';
  onClick?: () => void;
}

export const SolidCardPreview: React.FC<SolidCardPreviewProps> = ({
  character,
  backgroundColor,
  userName = '',
  userRole = '',
  interests = [],
  goals = [],
  region = '',
  school = '',
  schoolName = '',
  sinceYear = '',
  size = 'large',
  onClick,
}) => {
  const backgroundImageUrl = backgroundColor?.imageUrl;
  const gradientStart = backgroundColor?.gradientStart || 'rgba(171, 200, 255, 0.8)';
  const gradientEnd = backgroundColor?.gradientEnd || 'rgba(255, 233, 226, 0.8)';
  const theme: CardTheme = backgroundColor?.theme || 'light';

  const displayedInterests = interests.slice(0, 2);
  const hasMore = interests.length > 2;
  const displayedGoals = goals.slice(0, 3);

  // 그라디언트 색상에서 실제 색상 추출 (rgba 형식 처리)
  const extractColor = (color: string): string => {
    if (color.startsWith('rgba(')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }
    return color;
  };

  return (
    <div style={getCardStyle(size, !!onClick)} onClick={onClick} role={onClick ? 'button' : undefined}>
      {backgroundImageUrl ? (
        <CardBackgroundImage size={size} imageUrl={backgroundImageUrl} />
      ) : (
        <CardBackgroundSvg
          size={size}
          gradientStart={extractColor(gradientStart)}
          gradientEnd={extractColor(gradientEnd)}
        />
      )}
      <span style={getLogoStyle(size, theme)}>SOLID</span>
      {character && (
        <img
          src={character.imageUrl}
          alt={character.name}
          style={getCharacterStyle(size)}
        />
      )}
      <div style={getUserInfoStyle(size)}>
        {userName && <p style={getNameStyle(size, theme)}>{userName}</p>}
        {userRole && <p style={getRoleStyle(size, theme)}>{userRole}</p>}
      </div>
      {interests.length > 0 && (
        <div style={getTagsContainerStyle(size)}>
          {displayedInterests.map((interest) => (
            <div key={interest.id} style={getTagStyle(size)}>
              {interest.icon && (
                <div style={getTagIconStyle(size)}>
                  <img
                    src={interest.icon}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <span style={getTagTextStyle(size, theme)}>{interest.name}</span>
            </div>
          ))}
          {hasMore && (
            <div style={getMoreTagStyle(size)}>
              <div style={getDotsStyle(size)}>
                <div style={getDotStyle(size)} />
                <div style={getDotStyle(size)} />
                <div style={getDotStyle(size)} />
              </div>
            </div>
          )}
        </div>
      )}
      {displayedGoals.length > 0 && (
        <div style={getGoalsContainerStyle(size)}>
          {displayedGoals.map((goal, index) => (
            <p key={index} style={getGoalStyle(size, index, theme)}>{goal}</p>
          ))}
        </div>
      )}
      {(region || school || schoolName || sinceYear) && (
        <div style={getFooterStyle(size)}>
          {(region || school || schoolName) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5.4px' }}>
              {region && <span style={getSchoolStyle(size, theme)}>{region}</span>}
              {region && school && (
                <svg width="1" height="14" viewBox="0 0 1 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0.5" y1="0" x2="0.5" y2="14" stroke={theme === 'light' ? '#848484' : '#FFFFFF'} strokeOpacity="0.5" />
                </svg>
              )}
              {school && <span style={{ ...getSchoolStyle(size, theme), fontWeight: 400 }}>{school}</span>}
              {!region && !school && schoolName && <span style={getSchoolStyle(size, theme)}>{schoolName}</span>}
            </div>
          )}
          {sinceYear && <span style={getSinceStyle(size, theme)}>SINCE {sinceYear}</span>}
        </div>
      )}
    </div>
  );
};

export default SolidCardPreview;
