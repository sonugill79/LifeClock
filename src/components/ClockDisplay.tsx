import React from 'react';
import type { TimeLived } from '../types';
import { formatTime } from '../utils/timeCalculations';

interface ClockDisplayProps {
  time: TimeLived;
  label: string;
  variant: 'lived' | 'remaining';
}

export const ClockDisplay = React.memo<ClockDisplayProps>(({ time, label, variant }) => {
  const colorClass = variant === 'lived' ? 'clock-lived' : 'clock-remaining';

  return (
    <div className={`clock-display ${colorClass}`}>
      <h2 className="clock-label">{label}</h2>
      <div className="clock-content">
        <div className="time-breakdown">
          <div className="time-unit">
            <span className="time-value">{time.years}</span>
            <span className="time-label">{time.years === 1 ? 'year' : 'years'}</span>
          </div>
          <div className="time-unit">
            <span className="time-value">{time.months}</span>
            <span className="time-label">{time.months === 1 ? 'month' : 'months'}</span>
          </div>
          <div className="time-unit">
            <span className="time-value">{time.days}</span>
            <span className="time-label">{time.days === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
        <div className="time-display">
          <span className="time-hms">{formatTime(time.hours, time.minutes, time.seconds)}</span>
        </div>
      </div>
    </div>
  );
});

ClockDisplay.displayName = 'ClockDisplay';
