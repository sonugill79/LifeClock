import type { TimelineUnit, IconStyle } from '../types';

interface TimelineIconProps {
  unit: TimelineUnit;
  iconStyle: IconStyle;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
}

export function TimelineIcon({ unit, iconStyle, onMouseEnter, onMouseLeave, className: additionalClassName }: TimelineIconProps) {
  const className = [
    'timeline-icon',
    `icon-style-${iconStyle}`,
    unit.isPreBirth ? 'pre-birth' : (unit.isLived ? 'lived' : 'remaining'),
    unit.isCurrent ? 'current' : '',
    additionalClassName,
  ]
    .filter(Boolean)
    .join(' ');

  // Stagger animation delay based on index
  const style = { '--icon-index': unit.index } as React.CSSProperties;

  // Unicode style uses text content
  if (iconStyle === 'unicode') {
    const symbol = unit.isPreBirth ? '·' : (unit.isLived ? '■' : '□');
    return (
      <span
        className={className}
        style={style}
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
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={unit.detailsText}
    />
  );
}
