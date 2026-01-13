import { useState, useRef, useEffect } from 'react';
import type { LifeExpectancySource } from '../types';

interface DataSourceBadgeProps {
  source: LifeExpectancySource;
  lifeExpectancy: number;
  whoEstimate?: number; // For comparison when using income data
}

/**
 * DataSourceBadge Component
 *
 * Shows which data source is being used (income vs country).
 * Expandable popover with methodology details.
 *
 * Features:
 * - WCAG 2.1 AA compliant
 * - Popover (not modal) per Decision #6
 * - ESC key closes popover
 * - Click outside closes popover
 */
export function DataSourceBadge({
  source,
  lifeExpectancy,
  whoEstimate,
}: DataSourceBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus(); // Return focus to trigger button
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const isIncomeData = source.type === 'income';

  return (
    <div className="data-source-badge-container">
      {/* Compact Badge Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="data-source-badge"
        aria-expanded={isOpen}
        aria-controls="source-details-popover"
        aria-label={`Data source: ${source.description}. Click for details.`}
      >
        <span className="badge-icon" aria-hidden="true">
          📊
        </span>
        <span className="badge-text">
          {isIncomeData ? (
            <>
              US Income Data
              {source.details?.incomePercentile && (
                <span className="badge-detail"> ({source.details.incomePercentile}th %ile)</span>
              )}
            </>
          ) : (
            'WHO Country Data'
          )}
        </span>
        <svg
          className={`badge-chevron ${isOpen ? 'open' : ''}`}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
          />
        </svg>
      </button>

      {/* Expandable Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          id="source-details-popover"
          className="data-source-popover"
          role="tooltip"
        >
          <div className="popover-header">
            <h3 className="popover-title">Data Source Details</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="popover-close"
              aria-label="Close details"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>

          <div className="popover-content">
            <div className="popover-section">
              <p className="popover-label">Current Estimate:</p>
              <p className="popover-value">{lifeExpectancy.toFixed(1)} years</p>
            </div>

            <div className="popover-section">
              <p className="popover-label">Data Source:</p>
              <p className="popover-value">{source.dataSource}</p>
            </div>

            {isIncomeData && source.details && (
              <>
                <div className="popover-section">
                  <p className="popover-label">Your Data:</p>
                  <ul className="popover-list">
                    {source.details.incomePercentile && (
                      <li>Income: {source.details.incomePercentile}th percentile</li>
                    )}
                    {source.details.gender && (
                      <li>Gender: {source.details.gender}</li>
                    )}
                    {source.details.country && (
                      <li>Country: {source.details.country}</li>
                    )}
                  </ul>
                </div>

                {whoEstimate && (
                  <div className="popover-section popover-comparison">
                    <p className="popover-label">For Comparison:</p>
                    <p className="popover-text">
                      WHO Country Data would estimate <strong>{whoEstimate.toFixed(1)} years</strong>
                    </p>
                    <p className="popover-note">
                      Income-based data provides more accurate estimates for US residents.
                    </p>
                  </div>
                )}

                <div className="popover-section">
                  <p className="popover-text-small">
                    Based on research by Chetty et al. (2016) using 1.4 billion tax records
                    paired with Social Security mortality data.
                  </p>
                </div>
              </>
            )}

            {!isIncomeData && (
              <div className="popover-section">
                <p className="popover-text-small">
                  Life expectancy estimates from World Health Organization (WHO)
                  based on country and gender.
                </p>
              </div>
            )}

            <div className="popover-footer">
              <a
                href={isIncomeData ? "https://healthinequality.org" : "https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy"}
                target="_blank"
                rel="noopener noreferrer"
                className="popover-link"
              >
                {isIncomeData ? "View Research →" : "View WHO Data →"}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
