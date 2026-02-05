import React from 'react';
import { colors, typography } from '../styles/tokens';

interface TabItem {
  id: string;
  label: string;
}

interface TabProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Tab Component
 * Figma: Component 17 (924:6085)
 * - 활성 탭: 하단 보더 + 어두운 텍스트 (#222)
 * - 비활성 탭: 회색 텍스트 (#848484)
 */
export const Tab: React.FC<TabProps> = ({ tabs, activeTab, onTabChange }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
  };

  const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 14px',
    borderBottom: isActive ? `2px solid ${colors.dark}` : 'none',
    cursor: 'pointer',
  });

  const getLabelStyle = (isActive: boolean): React.CSSProperties => ({
    ...typography.bodyLight18,
    color: isActive ? colors.dark : colors.gray,
  });

  return (
    <div style={containerStyle}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <div
            key={tab.id}
            style={getTabStyle(isActive)}
            onClick={() => onTabChange(tab.id)}
          >
            <span style={getLabelStyle(isActive)}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Tab;
