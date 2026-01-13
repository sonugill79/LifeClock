import { useMemo } from 'react';
import { DataSourceBadge } from './DataSourceBadge';
import { getLifeExpectancyWithFallback } from '../utils/lifeExpectancyCalculator';
import { formatTime } from '../utils/timeCalculations';
import type { TimeLived, LifeExpectancySource } from '../types';

interface TimeRemainingProps {
  time: TimeLived;
  isOverExpectancy?: boolean;
  lifeExpectancy: number | null;
  source: LifeExpectancySource | null;
}

export function TimeRemaining({
  time,
  isOverExpectancy = false,
  lifeExpectancy,
  source,
}: TimeRemainingProps) {
  // Calculate WHO estimate for comparison when using income data
  const whoEstimate = useMemo(() => {
    if (source?.type === 'income' && source.details?.country && source.details?.gender) {
      return getLifeExpectancyWithFallback(source.details.country, source.details.gender as 'male' | 'female' | 'other');
    }
    return undefined;
  }, [source]);

  if (isOverExpectancy) {
    return (
      <div className="clock-display clock-remaining over-expectancy">
        <h2 className="clock-label">Time Ahead</h2>
        <div className="clock-content">
          <p className="expectancy-message">
            🎉 Living beyond expectations!
          </p>
          <p className="expectancy-submessage">
            You've surpassed the statistical life expectancy.
            Every moment is a bonus!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="clock-display clock-remaining">
      {/* Inline badge in header - Variant A */}
      <div className="clock-label-with-badge">
        <h2 className="clock-label">Time Ahead</h2>
        {source && lifeExpectancy !== null && (
          <>
            <span className="label-separator">·</span>
            <DataSourceBadge
              source={source}
              lifeExpectancy={lifeExpectancy}
              whoEstimate={whoEstimate}
            />
          </>
        )}
      </div>

      {/* Clock content */}
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
}
