import { useMemo } from 'react';
import { TimelineGrid } from './TimelineGrid';
import { calculateTimelineData, getUnitName } from '../utils/timelineCalculations';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { TimelineGranularity, IconStyle } from '../types';

interface LifeTimelineProps {
  birthday: Date;
  currentTime: Date;
  lifeExpectancy: number;
}

export function LifeTimeline({ birthday, currentTime, lifeExpectancy }: LifeTimelineProps) {
  // Persist granularity and icon style preferences in localStorage
  const [granularity, setGranularity] = useLocalStorage<TimelineGranularity>(
    'lifeclock-timeline-granularity',
    'years' // Default to years
  );
  const [iconStyle, setIconStyle] = useLocalStorage<IconStyle>(
    'lifeclock-timeline-icon-style',
    'squares'
  );

  // Calculate timeline data based on current granularity
  const timelineData = useMemo(
    () => calculateTimelineData(birthday, currentTime, lifeExpectancy, granularity),
    [birthday, currentTime, lifeExpectancy, granularity]
  );

  const { layout } = timelineData;

  return (
    <div className="life-timeline">
      {/* Header with stats */}
      <div className="timeline-header">
        <h2 className="timeline-title">Life Timeline</h2>
        <div className="timeline-stats">
          <span className="stat-lived">
            {granularity === 'years' && layout.actualYears !== undefined
              ? `${layout.actualYears} years`
              : `${layout.livedUnits.toLocaleString()} ${getUnitName(granularity, layout.livedUnits)}`}
          </span>
          <span className="stat-separator">/</span>
          <span className="stat-total">
            {granularity === 'years' && layout.actualTotalYears !== undefined
              ? `${layout.actualTotalYears} years`
              : `${layout.totalUnits.toLocaleString()} ${getUnitName(granularity, layout.totalUnits)}`}
          </span>
          <span className="stat-percentage">
            ({layout.percentComplete.toFixed(1)}% complete)
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="timeline-controls">
        <div className="granularity-switcher">
          <button
            className={`granularity-button ${granularity === 'years' ? 'active' : ''}`}
            onClick={() => setGranularity('years')}
          >
            Years
          </button>
          <button
            className={`granularity-button ${granularity === 'months' ? 'active' : ''}`}
            onClick={() => setGranularity('months')}
          >
            Months
          </button>
          <button
            className={`granularity-button ${granularity === 'weeks' ? 'active' : ''}`}
            onClick={() => setGranularity('weeks')}
          >
            Weeks
          </button>
        </div>

        {/* Icon Style Switcher */}
        <div className="icon-style-switcher">
          <label htmlFor="icon-style">Icon Style:</label>
          <select
            id="icon-style"
            value={iconStyle}
            onChange={(e) => setIconStyle(e.target.value as IconStyle)}
            className="icon-style-select"
          >
            <option value="squares">Squares</option>
            <option value="circles">Circles</option>
            <option value="unicode">Unicode</option>
            <option value="rounded-rect">Rounded Rect</option>
          </select>
        </div>
      </div>

      {/* The Grid */}
      <TimelineGrid
        timelineData={timelineData}
        iconStyle={iconStyle}
        granularity={granularity}
      />
    </div>
  );
}
