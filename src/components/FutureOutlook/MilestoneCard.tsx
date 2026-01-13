/**
 * MilestoneCard.tsx
 *
 * Purpose: Individual milestone display card component
 * Phase: Phase 3.1 - UI Components
 * Dependencies: types/milestones
 * Used by: FutureOutlook component
 */

import React from 'react';
import { Milestone } from '../../types/milestones';
import './MilestoneCard.css';

interface MilestoneCardProps {
  milestone: Milestone;
  onClick?: () => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, onClick }) => {
  return (
    <div className="milestone-card" onClick={onClick} title={milestone.description}>
      <div className="milestone-card__icon">{milestone.icon}</div>
      <div className="milestone-card__count">{milestone.count}</div>
      <div className="milestone-card__label">{milestone.label}</div>
    </div>
  );
};
