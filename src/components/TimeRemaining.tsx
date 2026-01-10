import { ClockDisplay } from './ClockDisplay';
import type { TimeLived } from '../types';

interface TimeRemainingProps {
  time: TimeLived;
  isOverExpectancy?: boolean;
}

export function TimeRemaining({ time, isOverExpectancy = false }: TimeRemainingProps) {
  if (isOverExpectancy) {
    return (
      <div className="clock-display clock-remaining over-expectancy">
        <h2 className="clock-label">Time Remaining</h2>
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
    <ClockDisplay
      time={time}
      label="Time Remaining"
      variant="remaining"
    />
  );
}
