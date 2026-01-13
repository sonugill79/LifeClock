/**
 * FutureOutlook.tsx
 *
 * Purpose: Main container component for Future Outlook feature
 * Phase: Phase 3.3 - UI Components
 * Dependencies: MilestoneCard, useMilestones, useFutureOutlookStorage
 * Used by: App.tsx
 */

import React, { useState } from 'react';
import { MilestoneCard } from './MilestoneCard';
import { MilestoneConfig } from './MilestoneConfig';
import { useMilestones } from '../../hooks/useMilestones';
import { useFutureOutlookStorage } from '../../hooks/useFutureOutlookStorage';
import './FutureOutlook.css';

interface FutureOutlookProps {
  birthDate: Date;
  lifeExpectancyDate: Date;
}

const taglines = [
  "Make every moment count",
  "Time is finite. Experiences are precious.",
  "Every day is a gift",
  "Live intentionally",
  "Seize the day"
];

export const FutureOutlook: React.FC<FutureOutlookProps> = ({
  birthDate,
  lifeExpectancyDate,
}) => {
  const { data, updateMilestones, updateHolidays, toggleMotivational } = useFutureOutlookStorage();
  const milestones = useMilestones(birthDate, lifeExpectancyDate, data);
  const [showConfig, setShowConfig] = useState(false);
  const [isCalculating, setIsCalculating] = useState(true);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  // Check if user has exceeded life expectancy
  const isOverExpectancy = new Date() > lifeExpectancyDate;

  // Simulate calculation delay for skeleton - only on initial mount
  React.useEffect(() => {
    const timer = setTimeout(() => setIsCalculating(false), 400);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once on mount

  // Tagline rotation
  React.useEffect(() => {
    if (!data.showMotivational) return;

    const interval = setInterval(() => {
      setCurrentTaglineIndex(prev => (prev + 1) % taglines.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [data.showMotivational]);

  if (isOverExpectancy) {
    return (
      <section className="future-outlook">
        <div className="future-outlook__header">
          <h2 className="future-outlook__title">Future Outlook</h2>
        </div>
        <div className="future-outlook__celebration">
          <div className="future-outlook__celebration-icon">🎉</div>
          <p className="future-outlook__celebration-text">
            You're living beyond expectations!
          </p>
          <p className="future-outlook__celebration-subtext">
            Every day is a gift. Make the most of it!
          </p>
        </div>
      </section>
    );
  }

  // Skeleton loading state
  if (isCalculating) {
    return (
      <section className="future-outlook">
        <div className="future-outlook__header">
          <h2 className="future-outlook__title">Future Outlook</h2>
          {data.showMotivational && (
            <p className="future-outlook__tagline future-outlook__tagline--animated">
              {taglines[currentTaglineIndex]}
            </p>
          )}
        </div>
        <div className="future-outlook__grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="milestone-card milestone-card--skeleton">
              <div className="skeleton-shimmer" />
              <div className="skeleton-icon" />
              <div className="skeleton-count" />
              <div className="skeleton-label" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Empty state if no milestones selected
  if (milestones.length === 0) {
    return (
      <section className="future-outlook">
        <div className="future-outlook__header">
          <h2 className="future-outlook__title">Future Outlook</h2>
          <button
            className="future-outlook__config-button"
            onClick={() => setShowConfig(true)}
            aria-label="Configure milestones"
          >
            ⚙️
          </button>
        </div>
        <div className="future-outlook__empty">
          <div className="future-outlook__empty-icon">🎯</div>
          <h3 className="future-outlook__empty-title">
            Choose Your Milestones
          </h3>
          <p className="future-outlook__empty-description">
            Select which life events you'd like to track. See how many birthdays,
            summers, weekends, and holidays you have left to make them count.
          </p>
          <button
            className="future-outlook__empty-button"
            onClick={() => setShowConfig(true)}
          >
            Configure Milestones
          </button>
        </div>
        {showConfig && (
          <MilestoneConfig
            data={data}
            onUpdateMilestones={updateMilestones}
            onUpdateHolidays={updateHolidays}
            onToggleMotivational={toggleMotivational}
            onClose={() => setShowConfig(false)}
          />
        )}
      </section>
    );
  }

  return (
    <section className="future-outlook" aria-labelledby="future-outlook-title">
      <div className="future-outlook__header">
        <h2 id="future-outlook-title" className="future-outlook__title">
          Future Outlook
        </h2>
        {data.showMotivational && (
          <p className="future-outlook__tagline future-outlook__tagline--animated" role="doc-subtitle">
            {taglines[currentTaglineIndex]}
          </p>
        )}
        <button
          className="future-outlook__config-button"
          onClick={() => setShowConfig(!showConfig)}
          aria-label="Configure Future Outlook milestones"
          aria-expanded={showConfig}
        >
          ⚙️
        </button>
      </div>

      <div className="future-outlook__grid" role="list">
        {milestones.map(milestone => (
          <div key={milestone.id} role="listitem">
            <MilestoneCard milestone={milestone} />
          </div>
        ))}
      </div>

      {showConfig && (
        <MilestoneConfig
          data={data}
          onUpdateMilestones={updateMilestones}
          onUpdateHolidays={updateHolidays}
          onToggleMotivational={toggleMotivational}
          onClose={() => setShowConfig(false)}
        />
      )}
    </section>
  );
};
