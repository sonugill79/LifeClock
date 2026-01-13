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
import { useMilestones } from '../../hooks/useMilestones';
import { useFutureOutlookStorage } from '../../hooks/useFutureOutlookStorage';
import './FutureOutlook.css';

interface FutureOutlookProps {
  birthDate: Date;
  lifeExpectancyDate: Date;
}

export const FutureOutlook: React.FC<FutureOutlookProps> = ({
  birthDate,
  lifeExpectancyDate,
}) => {
  const { data } = useFutureOutlookStorage();
  const milestones = useMilestones(birthDate, lifeExpectancyDate, data);
  const [showConfig, setShowConfig] = useState(false);

  // Check if user has exceeded life expectancy
  const isOverExpectancy = new Date() > lifeExpectancyDate;

  if (isOverExpectancy) {
    return (
      <section className="future-outlook">
        <div className="future-outlook__header">
          <h2 className="future-outlook__title">Future Outlook</h2>
        </div>
        <div className="future-outlook__celebration">
          <p className="future-outlook__celebration-text">
            🎉 You're living beyond expectations! 🎉
          </p>
          <p className="future-outlook__celebration-subtext">
            Every day is a gift. Make the most of it!
          </p>
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
          <p>No milestones selected.</p>
          <button
            className="future-outlook__empty-button"
            onClick={() => setShowConfig(true)}
          >
            Configure Milestones
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="future-outlook">
      <div className="future-outlook__header">
        <h2 className="future-outlook__title">Future Outlook</h2>
        {data.showMotivational && (
          <p className="future-outlook__tagline">Make every moment count</p>
        )}
        <button
          className="future-outlook__config-button"
          onClick={() => setShowConfig(!showConfig)}
          aria-label="Configure milestones"
        >
          ⚙️
        </button>
      </div>

      <div className="future-outlook__grid">
        {milestones.map(milestone => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
      </div>

      {showConfig && (
        <div className="future-outlook__config-placeholder">
          {/* MilestoneConfig will be implemented in Phase 4 */}
          <p>Configuration panel coming soon...</p>
          <button onClick={() => setShowConfig(false)}>Close</button>
        </div>
      )}
    </section>
  );
};
