import React from 'react';
import { colors, fonts, fontWeights } from '../styles/tokens';

interface SolidLogoProps {
  size?: number;
  color?: string;
}

export const SolidLogo: React.FC<SolidLogoProps> = ({
  size = 18.629,
  color = colors.blueDefault,
}) => {
  const style: React.CSSProperties = {
    fontFamily: fonts.oneShinhan,
    fontSize: `${size}px`,
    fontWeight: fontWeights.light,
    lineHeight: 1.2,
    letterSpacing: '-0.373px',
    color: color,
  };

  return (
    <span style={style} data-node-id="1970:25740">
      SOLID
    </span>
  );
};

export default SolidLogo;
