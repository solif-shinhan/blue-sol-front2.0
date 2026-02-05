import React, { useState } from 'react';
import { Button } from '../../../components/Button';
import { ProgressHeader } from '../../../components/ProgressHeader';
import { PlusIcon, CloseIcon } from '../../../components/Icons';
import { goalInputStyles as styles } from './GoalInput-2';

interface GoalInputProps {
  initialGoals?: string[];
  onBack?: () => void;
  onNext?: (goals: string[]) => void;
}

export const GoalInput: React.FC<GoalInputProps> = ({
  initialGoals,
  onBack,
  onNext,
}) => {
  const [goals, setGoals] = useState<string[]>(
    initialGoals && initialGoals.length > 0 ? initialGoals : ['']
  );

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleAddGoal = () => {
    if (goals.length < 5) {
      setGoals([...goals, '']);
    }
  };

  const handleRemoveGoal = (index: number) => {
    if (goals.length > 1) {
      const newGoals = goals.filter((_, i) => i !== index);
      setGoals(newGoals);
    }
  };

  const handleNext = () => {
    const validGoals = goals.filter((g) => g.trim().length > 0);
    if (validGoals.length > 0 && onNext) {
      onNext(validGoals);
    }
  };

  const hasValidGoal = goals.some((g) => g.trim().length > 0);

  return (
    <div style={styles.containerStyle}>
      <div style={styles.headerStyle}>
        <ProgressHeader totalSteps={4} currentStep={3} onBack={onBack} />
      </div>
      <div style={styles.titleContainerStyle}>
        <h1 style={styles.titleStyle}>
          올해 이루고 싶은
          <br />
          목표를 알려주세요
        </h1>
        <p style={styles.subtitleStyle}>목표를 한 문장으로 간결하게 작성해주세요.</p>
      </div>
      <div style={styles.goalsContainerStyle}>
        {goals.map((goal, index) => (
          <div key={index} style={styles.inputWrapperStyle}>
            <input
              type="text"
              style={styles.inputStyle}
              placeholder="목표를 입력해주세요"
              value={goal}
              onChange={(e) => handleGoalChange(index, e.target.value)}
            />
            {goal.length > 0 && (
              <button
                type="button"
                style={styles.removeButtonStyle}
                onClick={() => handleRemoveGoal(index)}
              >
                <CloseIcon size={12} color="#3971E0" strokeWidth={3} />
              </button>
            )}
          </div>
        ))}
        {goals.length < 5 && (
          <div style={styles.addButtonContainerStyle}>
            <button type="button" style={styles.addButtonStyle} onClick={handleAddGoal}>
              <PlusIcon size={16} color="#A6A6A6" />
            </button>
          </div>
        )}
      </div>
      <div style={styles.buttonContainerStyle}>
        <Button
          variant={hasValidGoal ? 'primary' : 'secondary'}
          disabled={!hasValidGoal}
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default GoalInput;
