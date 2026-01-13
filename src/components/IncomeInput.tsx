import { useState, useMemo } from 'react';
import { getLifeExpectancyByIncome } from '../utils/incomeLifeExpectancyCalculator';

interface IncomeInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  onSkip: () => void;
  currentLifeExpectancy: number | null;
  gender: 'male' | 'female' | 'other' | null;
}

/**
 * IncomeInput Component
 *
 * Provides a slider for users to input their household income percentile (1-100).
 * Features:
 * - WCAG 2.1 AA compliant (44×44px touch targets, ARIA, keyboard nav)
 * - Live preview of life expectancy changes (Decision #3)
 * - Dollar amount display at key percentiles
 * - Positive framing for all outcomes
 *
 * @see Decision #2: Percentile Slider
 * @see Decision #3: Live Preview
 */
export function IncomeInput({
  value,
  onChange,
  onSkip,
  currentLifeExpectancy,
  gender,
}: IncomeInputProps) {
  const [sliderValue, setSliderValue] = useState(value || 50);

  // Calculate new life expectancy based on slider position
  const newLifeExpectancy = useMemo(() => {
    if (!gender) return null;
    return getLifeExpectancyByIncome(gender, sliderValue);
  }, [gender, sliderValue]);

  // Calculate difference from WHO country estimate
  const difference = useMemo(() => {
    if (!newLifeExpectancy || !currentLifeExpectancy) return null;
    return newLifeExpectancy - currentLifeExpectancy;
  }, [newLifeExpectancy, currentLifeExpectancy]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    onChange(newValue);
  };

  // Approximate dollar amounts for key percentiles (2016 data)
  const getDollarDisplay = (percentile: number): string => {
    // Sample data points from Health Inequality Project
    const dollarMap: { [key: number]: string } = {
      1: '$433',
      5: '$2.5k',
      10: '$5.4k',
      25: '$20k',
      50: '$57k',
      75: '$97k',
      90: '$175k',
      95: '$274k',
      99: '$1.9M',
      100: '$2.8M',
    };

    // Find closest percentile with dollar data
    const percentiles = Object.keys(dollarMap).map(Number).sort((a, b) => a - b);
    const closest = percentiles.reduce((prev, curr) =>
      Math.abs(curr - percentile) < Math.abs(prev - percentile) ? curr : prev
    );

    return dollarMap[closest];
  };

  return (
    <div className="income-input">
      <div className="income-input-header">
        <label htmlFor="income-slider" className="income-input-label">
          Household Income Percentile
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
        Providing your income percentile gives you a more accurate estimate.
      </p>

      {/* Slider Input - WCAG 2.1 AA Compliant */}
      <div className="slider-container">
        <input
          id="income-slider"
          type="range"
          min="1"
          max="100"
          step="1"
          value={sliderValue}
          onChange={handleSliderChange}
          className="income-slider"
          aria-label="Income percentile from 1st to 100th"
          aria-valuemin={1}
          aria-valuemax={100}
          aria-valuenow={sliderValue}
          aria-valuetext={`${sliderValue}th percentile, approximately ${getDollarDisplay(sliderValue)} per year`}
          style={{ touchAction: 'manipulation' }}
        />

        {/* Percentile markers */}
        <div className="percentile-markers">
          <span className="marker">1st</span>
          <span className="marker">25th</span>
          <span className="marker">50th</span>
          <span className="marker">75th</span>
          <span className="marker">99th</span>
        </div>
      </div>

      {/* Current value display */}
      <div className="percentile-display">
        <strong>{sliderValue}th percentile</strong>
        <span className="dollar-amount">~{getDollarDisplay(sliderValue)}/year</span>
      </div>

      {/* Live preview - Decision #3: MANDATORY */}
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
