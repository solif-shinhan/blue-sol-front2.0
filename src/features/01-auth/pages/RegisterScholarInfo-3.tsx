import React, { useState, useRef, useEffect } from 'react';
import { colors, typography } from '../../../styles/tokens';

const REGION_OPTIONS = [
  '서울', '경기', '인천', '부산', '대구', '대전', '울산', '세종',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

export interface SelectFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  placeholder = '입력해주세요',
  value,
  onChange,
  options = REGION_OPTIONS,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasValue = value.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Tab':
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex]);
        }
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '40px',
    position: 'relative',
    zIndex: isOpen ? 9999 : 'auto',
  };

  const labelStyle: React.CSSProperties = {
    ...typography.bodySemiBold16,
    color: colors.dark,
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '240px',
    zIndex: isOpen ? 9999 : 'auto',
  };

  const inputBoxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '240px',
    height: '40px',
    padding: '0 11px',
    borderRadius: '12px',
    border: `1px solid ${isOpen || hasValue ? colors.blueDefault : colors.lightGray2}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    outline: 'none',
  };

  const valueStyle: React.CSSProperties = {
    ...(hasValue ? typography.bodyBold16 : typography.bodySemiBold14),
    color: hasValue ? colors.dark : colors.gray,
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '44px',
    left: 0,
    width: '240px',
    maxHeight: '205px',
    overflowY: 'auto',
    backgroundColor: colors.white,
    borderRadius: '12px',
    boxShadow: '0px 0px 30px 0px rgba(27, 37, 56, 0.1)',
    zIndex: 9999,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const getOptionStyle = (index: number): React.CSSProperties => ({
    ...typography.bodyBold16,
    color: colors.dark,
    padding: '10px',
    borderBottom: index === options.length - 1 ? 'none' : `1px solid ${colors.lightGray2}`,
    cursor: 'pointer',
    backgroundColor: index === highlightedIndex ? colors.bgWhiteGray : colors.white,
  });

  return (
    <div style={rowStyle} ref={containerRef}>
      <span style={labelStyle}>{label}</span>
      <div style={inputContainerStyle}>
        <div
          style={inputBoxStyle}
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        >
          <span style={valueStyle}>{value || placeholder}</span>
        </div>
        {isOpen && (
          <div ref={dropdownRef} style={dropdownStyle} className="hide-scrollbar">
            {options.map((option, index) => (
              <div
                key={option}
                style={getOptionStyle(index)}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};
