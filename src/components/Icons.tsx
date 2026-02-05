import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

/**
 * 뒤로가기 화살표 아이콘
 * Figma: IOS Arrow
 */
export const BackArrowIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#858585',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.29642 12L12.7875 3.27302C13.0764 2.97614 13.0699 2.50131 12.773 2.21246C12.4761 1.9236 12.0013 1.93011 11.7125 2.22698L2.71246 11.477C2.42918 11.7681 2.42918 12.2319 2.71246 12.523L11.7125 21.773C12.0013 22.0699 12.4761 22.0764 12.773 21.7875C13.0699 21.4987 13.0764 21.0239 12.7875 20.727L4.29642 12Z"
      fill={color}
    />
  </svg>
);

/**
 * 플러스 아이콘
 * Figma: + icon
 */
export const PlusIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#A6A6A6',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.66026 20V11.2949H0V8.66026H8.66026V0H11.2949V8.66026H20V11.2949H11.2949V20H8.66026Z"
      fill={color}
    />
  </svg>
);

/**
 * X (닫기) 아이콘
 * Figma: Dismiss icon
 */
export const CloseIcon: React.FC<IconProps & { strokeWidth?: number }> = ({
  size = 24,
  color = '#A6A6A6',
  strokeWidth = 2,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 검색 아이콘
 * Figma: Vector (Search)
 */
export const SearchIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#C8C8C8',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
    <path
      d="M16 16L20 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
