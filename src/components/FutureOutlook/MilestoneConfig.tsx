/**
 * MilestoneConfig.tsx
 *
 * Purpose: Configuration panel for selecting milestones and holidays
 * Phase: Phase 4.1 - Configuration System
 * Dependencies: types/milestones, useFutureOutlookStorage
 * Used by: FutureOutlook component
 */

import React, { useState, useEffect, useRef } from 'react';
import { FutureOutlookData } from '../../types/milestones';
import holidaysData from '../../data/holidays.json';
import './MilestoneConfig.css';

interface MilestoneConfigProps {
  data: FutureOutlookData;
  onUpdateMilestones: (milestones: string[]) => void;
  onUpdateHolidays: (holidays: string[]) => void;
  onToggleMotivational: () => void;
  onClose: () => void;
}

export const MilestoneConfig: React.FC<MilestoneConfigProps> = ({
  data,
  onUpdateMilestones,
  onUpdateHolidays,
  onToggleMotivational,
  onClose,
}) => {
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>(
    data.selectedMilestones
  );
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>(
    data.selectedHolidays
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    // Focus first element on mount
    firstFocusableRef.current?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modal.querySelectorAll(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, []);

  const availableMilestones = [
    { id: 'birthdays', label: 'Birthdays', icon: '🎂' },
    { id: 'summers', label: 'Summers', icon: '☀️' },
    { id: 'winters', label: 'Winters', icon: '❄️' },
    { id: 'spring', label: 'Springs', icon: '🌸' },
    { id: 'fall', label: 'Falls', icon: '🍂' },
    { id: 'weekends', label: 'Weekends', icon: '🏖️' },
  ];

  const toggleMilestone = (id: string) => {
    setSelectedMilestones(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  const toggleHoliday = (id: string) => {
    setSelectedHolidays(prev =>
      prev.includes(id)
        ? prev.filter(h => h !== id)
        : [...prev, id]
    );
  };

  const handleSave = () => {
    onUpdateMilestones(selectedMilestones);
    onUpdateHolidays(selectedHolidays);
    onClose();
  };

  return (
    <div className="milestone-config__overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="config-title">
      <div className="milestone-config__modal" ref={modalRef} onClick={e => e.stopPropagation()}>
        <div className="milestone-config__header">
          <h3 id="config-title">Configure Future Outlook</h3>
          <button
            ref={firstFocusableRef}
            className="milestone-config__close-button"
            onClick={onClose}
            aria-label="Close configuration"
          >
            ✕
          </button>
        </div>

        <div className="milestone-config__content">
          <section className="milestone-config__section">
            <h4>Select Milestones to Track</h4>
            <div className="milestone-config__checkbox-grid">
              {availableMilestones.map(milestone => (
                <label key={milestone.id} className="milestone-config__checkbox">
                  <input
                    type="checkbox"
                    checked={selectedMilestones.includes(milestone.id)}
                    onChange={() => toggleMilestone(milestone.id)}
                  />
                  <span className="milestone-config__checkbox-label">
                    {milestone.icon} {milestone.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="milestone-config__section">
            <h4>Select Holidays</h4>
            <div className="milestone-config__checkbox-grid">
              {[...holidaysData.fixed, ...holidaysData.calculated].map(holiday => (
                <label key={holiday.id} className="milestone-config__checkbox">
                  <input
                    type="checkbox"
                    checked={selectedHolidays.includes(holiday.id)}
                    onChange={() => toggleHoliday(holiday.id)}
                  />
                  <span className="milestone-config__checkbox-label">
                    {holiday.icon} {holiday.name}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="milestone-config__section">
            <h4>Display Options</h4>
            <label className="milestone-config__checkbox">
              <input
                type="checkbox"
                checked={data.showMotivational}
                onChange={onToggleMotivational}
              />
              <span className="milestone-config__checkbox-label">
                Show motivational messages
              </span>
            </label>
          </section>
        </div>

        <div className="milestone-config__footer">
          <button
            className="milestone-config__cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="milestone-config__save-button"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
