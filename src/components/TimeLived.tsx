import { ClockDisplay } from './ClockDisplay';
import type { TimeLived as TimeLivedType } from '../types';

interface TimeLivedProps {
  time: TimeLivedType;
}

export function TimeLived({ time }: TimeLivedProps) {
  return (
    <ClockDisplay
      time={time}
      label="Time Lived"
      variant="lived"
    />
  );
}
