import { useState, FormEvent, useMemo } from 'react';
import { getCountryList, getLifeExpectancyWithFallback } from '../utils/lifeExpectancyCalculator';
import { IncomeInput } from './IncomeInput';
import type { UserData } from '../types';

interface UserInputFormProps {
  onSubmit: (data: UserData) => void;
  initialData?: UserData;
}

export function UserInputForm({ onSubmit, initialData }: UserInputFormProps) {
  const [birthdayString, setBirthdayString] = useState<string>(
    initialData?.birthday ? initialData.birthday.toISOString().split('T')[0] : ''
  );
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(
    initialData?.gender || null
  );
  const [country, setCountry] = useState<string>(initialData?.country || '');
  const [incomePercentile, setIncomePercentile] = useState<number | undefined>(
    initialData?.incomePercentile
  );
  const [showIncomeInput, setShowIncomeInput] = useState<boolean>(
    initialData?.incomePercentile !== undefined
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const countries = getCountryList();

  // Calculate WHO country life expectancy for live preview
  const currentWHOEstimate = useMemo(() => {
    if (!country || !gender) return null;
    return getLifeExpectancyWithFallback(country, gender);
  }, [country, gender]);

  // Clear income percentile when country changes away from US
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    if (newCountry !== 'USA') {
      setIncomePercentile(undefined);
      setShowIncomeInput(false);
    }
  };

  // Handle Skip button - collapse the income input
  const handleSkipIncome = () => {
    setIncomePercentile(undefined);
    setShowIncomeInput(false);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate birthday
    if (!birthdayString) {
      newErrors.birthday = 'Birthday is required';
    } else {
      // Parse date in local timezone to avoid UTC conversion issues
      const [year, month, day] = birthdayString.split('-').map(Number);
      const birthday = new Date(year, month - 1, day);
      const now = new Date();
      const maxAge = 120;
      const maxAgeDate = new Date();
      maxAgeDate.setFullYear(maxAgeDate.getFullYear() - maxAge);

      if (birthday > now) {
        newErrors.birthday = 'Birthday cannot be in the future';
      } else if (birthday < maxAgeDate) {
        newErrors.birthday = `Birthday cannot be more than ${maxAge} years ago`;
      }
    }

    // Validate gender
    if (!gender) {
      newErrors.gender = 'Please select a gender';
    }

    // Validate country
    if (!country) {
      newErrors.country = 'Please select a country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Parse date in local timezone to avoid UTC conversion issues
    // birthdayString is in format "YYYY-MM-DD"
    const [year, month, day] = birthdayString.split('-').map(Number);
    const birthday = new Date(year, month - 1, day); // month is 0-indexed

    onSubmit({
      birthday,
      gender,
      country,
      incomePercentile,
    });
  };

  return (
    <form className="user-input-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Start Your LifeClock</h2>
        <p>Enter your information to see your time lived and remaining</p>
      </div>

      <div className="privacy-badge">
        <svg
          className="privacy-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Your data stays private - stored only on your device</span>
      </div>

      <div className="form-group">
        <label htmlFor="birthday">
          Date of Birth
          <span className="required">*</span>
        </label>
        <input
          type="date"
          id="birthday"
          value={birthdayString}
          onChange={(e) => setBirthdayString(e.target.value)}
          className={errors.birthday ? 'error' : ''}
          aria-invalid={!!errors.birthday}
          aria-describedby={errors.birthday ? 'birthday-error' : undefined}
        />
        {errors.birthday && (
          <span id="birthday-error" className="error-message" role="alert">
            {errors.birthday}
          </span>
        )}
      </div>

      <div className="form-group">
        <label>
          Gender
          <span className="required">*</span>
        </label>
        <p className="field-info">
          Used solely for life expectancy calculation based on WHO statistical data.
          This data is only available in binary categories and combined averages.
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
            />
            <span>Male</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
            />
            <span>Female</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="other"
              checked={gender === 'other'}
              onChange={() => setGender('other')}
            />
            <span>Other / Prefer not to specify</span>
          </label>
        </div>
        {errors.gender && (
          <span className="error-message" role="alert">
            {errors.gender}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="country">
          Country
          <span className="required">*</span>
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
          className={errors.country ? 'error' : ''}
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? 'country-error' : undefined}
        >
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <span id="country-error" className="error-message" role="alert">
            {errors.country}
          </span>
        )}
      </div>

      {/* Conditional Income Input - US users only (Decision #2) */}
      {country === 'USA' && (
        <div className="form-group income-field-container">
          {!showIncomeInput ? (
            // Show "Add Income" button when collapsed
            <div className="add-income-section">
              <p className="add-income-description">
                Research shows income affects US life expectancy by up to 14 years.
              </p>
              <button
                type="button"
                className="add-income-button"
                onClick={() => setShowIncomeInput(true)}
              >
                + Add Income for Better Accuracy
              </button>
            </div>
          ) : (
            // Show IncomeInput component when expanded
            <IncomeInput
              value={incomePercentile}
              onChange={setIncomePercentile}
              onSkip={handleSkipIncome}
              currentLifeExpectancy={currentWHOEstimate}
              gender={gender}
            />
          )}
        </div>
      )}

      <button type="submit" className="submit-button">
        {initialData ? 'Update Clock' : 'Start Your LifeClock'}
      </button>
    </form>
  );
}
