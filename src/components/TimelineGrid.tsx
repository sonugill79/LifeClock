import { useState } from 'react';
import { TimelineIcon } from './TimelineIcon';
import type { TimelineData, IconStyle, TimelineGranularity } from '../types';

interface TimelineGridProps {
  timelineData: TimelineData;
  iconStyle: IconStyle;
  granularity: TimelineGranularity;
}

export function TimelineGrid({ timelineData, iconStyle, granularity }: TimelineGridProps) {
  const [hoveredUnit, setHoveredUnit] = useState<number | null>(null);
  const { layout, units } = timelineData;

  return (
    <div className="timeline-grid-container">
      {/* Tooltip (positioned absolutely, shown on hover) */}
      {hoveredUnit !== null && (
        <div className="timeline-tooltip">
          {units[hoveredUnit].detailsText}
        </div>
      )}

      {/* Grid */}
      <div
        className={`timeline-grid timeline-grid-${granularity}`}
        style={{
          gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
        }}
      >
        {units.map((unit) => (
          <TimelineIcon
            key={unit.index}
            unit={unit}
            iconStyle={iconStyle}
            onMouseEnter={() => setHoveredUnit(unit.index)}
            onMouseLeave={() => setHoveredUnit(null)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="timeline-legend">
        <div className="legend-item">
          <div className={`legend-icon legend-lived icon-style-${iconStyle}`} />
          <span>Time Lived</span>
        </div>
        <div className="legend-item">
          <div className={`legend-icon legend-current icon-style-${iconStyle}`} />
          <span>Current Period</span>
        </div>
        <div className="legend-item">
          <div className={`legend-icon legend-remaining icon-style-${iconStyle}`} />
          <span>Time Remaining</span>
        </div>
      </div>
    </div>
  );
}
