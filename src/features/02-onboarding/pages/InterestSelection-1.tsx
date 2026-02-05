import React, { useState } from 'react';
import { colors, typography, frameSize } from '../../../styles/tokens';
import { Button } from '../../../components/Button';
import { ProgressHeader } from '../../../components/ProgressHeader';
import { CategoryChip } from '../../../components/CategoryChip';
import { CategoryType } from '../../../assets/icons';

interface InterestSelectionProps {
  initialInterests?: CategoryType[];
  onBack?: () => void;
  onNext?: (selectedCategories: CategoryType[]) => void;
}

const categoryRows: CategoryType[][] = [
  ['food', 'language'],
  ['movie', 'game', 'photo'],
  ['volunteer', 'travel'],
  ['soccer', 'basketball', 'baseball'],
  ['certificate', 'art', 'walk'],
  ['culture', 'reading'],
  ['study', 'economy'],
];

export const InterestSelection: React.FC<InterestSelectionProps> = ({
  initialInterests = [],
  onBack,
  onNext,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(initialInterests);

  const toggleCategory = (category: CategoryType) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const isValid = selectedCategories.length >= 2;

  const handleNext = () => {
    if (isValid && onNext) {
      onNext(selectedCategories);
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

  const chipsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '17px',
    top: '270px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
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
        <ProgressHeader totalSteps={4} currentStep={1} onBack={onBack} />
      </div>
      <div style={titleContainerStyle}>
        <h1 style={titleStyle}>관심사를 알려주세요</h1>
        <p style={subtitleStyle}>최소 2개 이상 선택해주세요</p>
      </div>
      <div style={chipsContainerStyle}>
        {categoryRows.map((row, rowIndex) => (
          <div key={rowIndex} style={rowStyle}>
            {row.map((category) => (
              <CategoryChip
                key={category}
                category={category}
                selected={selectedCategories.includes(category)}
                onClick={() => toggleCategory(category)}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={buttonContainerStyle}>
        <Button
          variant={isValid ? 'primary' : 'secondary'}
          disabled={!isValid}
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default InterestSelection;
