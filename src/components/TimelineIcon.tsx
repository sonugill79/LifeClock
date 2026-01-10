import type { TimelineUnit, IconStyle } from '../types';

interface TimelineIconProps {
  unit: TimelineUnit;
  iconStyle: IconStyle;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function TimelineIcon({ unit, iconStyle, onMouseEnter, onMouseLeave }: TimelineIconProps) {
  const className = [
    'timeline-icon',
    `icon-style-${iconStyle}`,
    unit.isPreBirth ? 'pre-birth' : (unit.isLived ? 'lived' : 'remaining'),
    unit.isCurrent ? 'current' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Unicode style uses text content
  if (iconStyle === 'unicode') {
    const symbol = unit.isPreBirth ? '·' : (unit.isLived ? '■' : '□');
    return (
      <span
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={unit.detailsText}
      >
        {symbol}
      </span>
    );
  }

  // All other styles use div with CSS styling
  return (
    <div
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={unit.detailsText}
    />
  );
}
