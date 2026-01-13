import { useState, useMemo, useEffect, useRef } from 'react';
import { getLifeExpectancyByIncome } from '../utils/incomeLifeExpectancyCalculator';
import {
  getPercentileFromIncome,
  getIncomeFromPercentile,
  formatIncome,
} from '../utils/incomePercentileMapper';

interface IncomeInputProps {
  value: number | undefined; // Percentile value (for storage)
  onChange: (percentile: number) => void;
  onSkip: () => void;
  currentLifeExpectancy: number | null;
  gender: 'male' | 'female' | 'other' | null;
}

/**
 * IncomeInput Component
 *
 * Allows users to input their household income in dollars.
 * Automatically converts to percentile for life expectancy calculation.
 *
 * Features:
 * - WCAG 2.1 AA compliant
 * - Live preview of life expectancy changes
 * - Dollar amount slider with percentile display
 * - Positive framing for all outcomes
 */
export function IncomeInput({
  value,
  onChange,
  onSkip,
  currentLifeExpectancy,
  gender,
}: IncomeInputProps) {
  // Internal state: dollar amount
  const [incomeAmount, setIncomeAmount] = useState<number>(57000); // Default ~50th percentile

  // Track the last percentile we sent to parent to avoid feedback loop
  const lastSentPercentile = useRef<number | undefined>(undefined);

  // Initialize income amount from percentile value (only from external changes)
  useEffect(() => {
    if (value !== undefined && gender) {
      // Only update if this is an external change (not from our own onChange)
      if (value !== lastSentPercentile.current) {
        const income = getIncomeFromPercentile(value, gender);
        if (income !== null) {
          setIncomeAmount(Math.round(income));
          lastSentPercentile.current = value;
        }
      }
    } else if (value === undefined) {
      // Reset to default when value is cleared (Skip button clicked)
      setIncomeAmount(57000); // Default ~50th percentile
      lastSentPercentile.current = undefined;
    }
  }, [value, gender]);

  // Calculate percentile from dollar amount
  const calculatedPercentile = useMemo(() => {
    if (!gender) return null;
    return getPercentileFromIncome(incomeAmount, gender);
  }, [incomeAmount, gender]);

  // Calculate new life expectancy
  const newLifeExpectancy = useMemo(() => {
    if (!gender || calculatedPercentile === null) return null;
    return getLifeExpectancyByIncome(gender, calculatedPercentile);
  }, [gender, calculatedPercentile]);

  // Calculate difference from WHO country estimate
  const difference = useMemo(() => {
    if (!newLifeExpectancy || !currentLifeExpectancy) return null;
    return newLifeExpectancy - currentLifeExpectancy;
  }, [newLifeExpectancy, currentLifeExpectancy]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value, 10);
    setIncomeAmount(newAmount);

    // Convert to percentile and notify parent
    if (gender) {
      const percentile = getPercentileFromIncome(newAmount, gender);
      if (percentile !== null) {
        lastSentPercentile.current = percentile; // Track what we sent
        onChange(percentile);
      }
    }
  };

  // Slider range: $0 to $2M (covers 1st to 100th percentile)
  const minIncome = 0;
  const maxIncome = 2000000;
  const step = 5000; // $5k increments for smoother UX

  return (
    <div className="income-input">
      <div className="income-input-header">
        <label htmlFor="income-slider" className="income-input-label">
          Annual Household Income
          <span className="optional-badge">Optional</span>
        </label>
        <button
          type="button"
          onClick={onSkip}
          className="skip-button"
          aria-label="Skip income question"
        >
          Skip
        </button>
      </div>

      <p className="income-input-description">
        Research shows income affects US life expectancy by up to 14 years.
        Enter your household income for a more accurate estimate.
      </p>

      {/* Slider Input - WCAG 2.1 AA Compliant */}
      <div className="slider-container">
        <input
          id="income-slider"
          type="range"
          min={minIncome}
          max={maxIncome}
          step={step}
          value={incomeAmount}
          onChange={handleSliderChange}
          className="income-slider"
          aria-label={`Annual household income from $${minIncome.toLocaleString()} to $${maxIncome.toLocaleString()}`}
          aria-valuemin={minIncome}
          aria-valuemax={maxIncome}
          aria-valuenow={incomeAmount}
          aria-valuetext={`${formatIncome(incomeAmount)} per year, ${calculatedPercentile}th percentile`}
          style={{ touchAction: 'manipulation' }}
        />

        {/* Income amount markers */}
        <div className="percentile-markers">
          <span className="marker">$0</span>
          <span className="marker">$500k</span>
          <span className="marker">$1M</span>
          <span className="marker">$1.5M</span>
          <span className="marker">$2M</span>
        </div>
      </div>

      {/* Current value display */}
      <div className="percentile-display">
        <strong>{formatIncome(incomeAmount)}/year</strong>
        {calculatedPercentile !== null && (
          <span className="dollar-amount">{calculatedPercentile}th percentile</span>
        )}
      </div>

      {/* Live preview */}
      {newLifeExpectancy !== null && (
        <div className="live-preview" role="status" aria-live="polite">
          <div className="preview-content">
            <p className="preview-title">More accurate estimate:</p>
            <p className="preview-value">
              <strong>{newLifeExpectancy.toFixed(1)} years</strong>
            </p>

            {/* Positive framing for all outcomes */}
            {difference !== null && difference > 0 && (
              <p className="preview-difference positive">
                +{difference.toFixed(1)} years compared to country average
              </p>
            )}

            {difference !== null && difference < 0 && (
              <p className="preview-difference neutral">
                Based on US income research (individual outcomes vary)
              </p>
            )}

            {difference !== null && Math.abs(difference) < 0.5 && (
              <p className="preview-difference neutral">
                Similar to country average
              </p>
            )}
          </div>

          <div className="preview-disclaimer">
            <svg className="info-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            <span>
              Life expectancy estimates are population averages.
              Individual outcomes vary based on many factors including lifestyle, genetics, and access to healthcare.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
