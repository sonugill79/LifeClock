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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className="milestone-card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      aria-label={`${milestone.label}: ${milestone.count} remaining`}
    >
      <div className="milestone-card__icon" aria-hidden="true">
        {milestone.icon}
      </div>
      <div className="milestone-card__count" aria-label={`${milestone.count}`}>
        {milestone.count}
      </div>
      <div className="milestone-card__label">
        {milestone.label}
      </div>
      <span className="sr-only">
        {milestone.description}
      </span>
    </article>
  );
};
