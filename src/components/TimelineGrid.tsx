import React, { useState, useEffect, useMemo } from 'react';
import { TimelineIcon } from './TimelineIcon';
import type { TimelineData, IconStyle, TimelineGranularity, TimelineUnit } from '../types';

interface TimelineGridProps {
  timelineData: TimelineData;
  iconStyle: IconStyle;
  granularity: TimelineGranularity;
}

// Group timeline units by year for mobile display
function groupByYear(units: TimelineUnit[]): Map<number, TimelineUnit[]> {
  const groups = new Map<number, TimelineUnit[]>();

  units.forEach(unit => {
    const year = Math.floor(unit.age);
    if (!groups.has(year)) {
      groups.set(year, []);
    }
    groups.get(year)!.push(unit);
  });

  return groups;
}

export function TimelineGrid({ timelineData, iconStyle, granularity }: TimelineGridProps) {
  const [hoveredUnit, setHoveredUnit] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { layout, units } = timelineData;

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Group units by year for mobile view (months and weeks)
  const yearGroups = useMemo(() => {
    if (!isMobile || granularity === 'years') return null;
    return groupByYear(units);
  }, [isMobile, granularity, units]);

  // Desktop: Multi-year rows for months view (5 years per row = 60 columns)
  const desktopColumns = useMemo(() => {
    if (isMobile || granularity !== 'months') return layout.columns;
    return 60; // 12 months × 5 years
  }, [isMobile, granularity, layout.columns]);

  return (
    <div className="timeline-grid-container">
      {/* Tooltip (positioned absolutely, shown on hover) */}
      {hoveredUnit !== null && (
        <div className="timeline-tooltip">
          {units[hoveredUnit].detailsText}
        </div>
      )}

      {/* Mobile: Year-grouped vertical layout for months/weeks */}
      {isMobile && yearGroups ? (
        <div className="timeline-mobile-grouped">
          {Array.from(yearGroups.entries()).map(([year, yearUnits]) => (
            <div key={year} className="timeline-year-group">
              <div className="year-group-label">
                <span className="year-age">Age {year}</span>
                <span className="year-range">
                  ({yearUnits[0].label} - {yearUnits[yearUnits.length - 1].label})
                </span>
              </div>
              <div className="year-group-grid">
                {yearUnits.map((unit) => (
                  <TimelineIcon
                    key={unit.index}
                    unit={unit}
                    iconStyle={iconStyle}
                    onMouseEnter={() => setHoveredUnit(unit.index)}
                    onMouseLeave={() => setHoveredUnit(null)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : granularity === 'months' && !isMobile ? (
        /* Desktop: Multi-year months view with year labels */
        <div className="timeline-grid timeline-grid-months-multi">
          {(() => {
            const yearsPerRow = 5;
            const monthsPerYear = 12;
            const totalYears = Math.ceil(units.length / monthsPerYear);
            const rows = Math.ceil(totalYears / yearsPerRow);

            return Array.from({ length: rows }, (_, rowIdx) => {
              const startYearIdx = rowIdx * yearsPerRow;
              const endYearIdx = Math.min(startYearIdx + yearsPerRow, totalYears);
              const yearsInRow = endYearIdx - startYearIdx;

              return (
                <div key={`row-${rowIdx}`} className="timeline-multi-year-row">
                  {/* Year labels row */}
                  <div className="timeline-year-labels-row">
                    {Array.from({ length: yearsInRow }, (_, yearOffset) => {
                      const yearIdx = startYearIdx + yearOffset;
                      const firstMonthIdx = yearIdx * monthsPerYear;
                      const firstMonth = units[firstMonthIdx];
                      if (!firstMonth) return null;

                      const yearLabel = firstMonth.label.split(' ')[1]; // "Jan 2024" -> "2024"
                      return (
                        <div key={`year-${yearIdx}`} className="timeline-year-label">
                          {yearLabel} <span className="age-label">(Age {firstMonth.age})</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Month icons row */}
                  <div className="timeline-months-icons-row">
                    {Array.from({ length: yearsInRow }, (_, yearOffset) => {
                      const yearIdx = startYearIdx + yearOffset;
                      const firstMonthIdx = yearIdx * monthsPerYear;
                      const yearUnits = units.slice(firstMonthIdx, firstMonthIdx + monthsPerYear);

                      return (
                        <div key={`year-months-${yearIdx}`} className="timeline-year-months">
                          {yearUnits.map((unit) => (
                            <TimelineIcon
                              key={unit.index}
                              unit={unit}
                              iconStyle={iconStyle}
                              onMouseEnter={() => setHoveredUnit(unit.index)}
                              onMouseLeave={() => setHoveredUnit(null)}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      ) : (
        /* Desktop: Standard grid layout for years/weeks */
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
      )}

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
