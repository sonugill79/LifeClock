import { useEffect, useState, FormEvent } from 'react';
import { THEMES, DEFAULT_THEME } from '../config/themes';
import { getCountryList } from '../utils/lifeExpectancyCalculator';
import type { ThemeName, UserData } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  userData: UserData;
  onUserDataChange: (data: UserData) => void;
}

export function Settings({ isOpen, onClose, currentTheme, onThemeChange, userData, onUserDataChange }: SettingsProps) {
  // Profile editing state
  const [birthdayString, setBirthdayString] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
  const [country, setCountry] = useState<string>('');
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});

  const countries = getCountryList();

  // Initialize form fields ONLY when modal opens (not on userData changes while open)
  useEffect(() => {
    if (isOpen && userData.birthday) {
      setBirthdayString(userData.birthday.toISOString().split('T')[0]);
      setGender(userData.gender);
      setCountry(userData.country || '');
      setProfileErrors({}); // Clear any errors when opening
    }
  }, [isOpen]); // Only depend on isOpen, not userData

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Live preview: temporarily apply theme on hover
  const handleThemePreview = (themeName: ThemeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
  };

  // Restore current theme when mouse leaves
  const handleThemePreviewEnd = () => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  };

  // Reset to default theme
  const handleReset = () => {
    onThemeChange(DEFAULT_THEME);
  };

  // Validate profile form
  const validateProfileForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate birthday
    if (!birthdayString) {
      newErrors.birthday = 'Birthday is required';
    } else {
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

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    // Parse date in local timezone
    const [year, month, day] = birthdayString.split('-').map(Number);
    const birthday = new Date(year, month - 1, day);

    onUserDataChange({
      birthday,
      gender,
      country,
    });

    // Clear errors after successful save
    setProfileErrors({});

    // Close modal to show success feedback
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="settings-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button
            className="settings-close"
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="settings-content">
          {/* Your Profile Section */}
          {userData.birthday && (
            <section className="settings-section">
              <h3>👤 Your Profile</h3>
              <p className="settings-description">
                Update your personal information
              </p>

              <form onSubmit={handleProfileSubmit} className="profile-form">
                {/* Birthday */}
                <div className="form-group">
                  <label htmlFor="profile-birthday">
                    Birthday <span className="required">*</span>
                  </label>
                  <input
                    id="profile-birthday"
                    type="date"
                    value={birthdayString}
                    onChange={(e) => setBirthdayString(e.target.value)}
                    className={profileErrors.birthday ? 'error' : ''}
                    required
                  />
                  {profileErrors.birthday && (
                    <span className="error-message">{profileErrors.birthday}</span>
                  )}
                </div>

                {/* Country */}
                <div className="form-group">
                  <label htmlFor="profile-country">
                    Country <span className="required">*</span>
                  </label>
                  <select
                    id="profile-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={profileErrors.country ? 'error' : ''}
                    required
                  >
                    <option value="">Select your country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {profileErrors.country && (
                    <span className="error-message">{profileErrors.country}</span>
                  )}
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label>
                    Gender <span className="required">*</span>
                  </label>
                  <p className="field-info">
                    Used for life expectancy calculations based on WHO data
                  </p>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="profile-gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={(e) => setGender(e.target.value as 'male')}
                      />
                      <span>Male</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="profile-gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={(e) => setGender(e.target.value as 'female')}
                      />
                      <span>Female</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="profile-gender"
                        value="other"
                        checked={gender === 'other'}
                        onChange={(e) => setGender(e.target.value as 'other')}
                      />
                      <span>Other</span>
                    </label>
                  </div>
                  {profileErrors.gender && (
                    <span className="error-message">{profileErrors.gender}</span>
                  )}
                </div>

                <button type="submit" className="profile-save-button">
                  Save Changes
                </button>
              </form>
            </section>
          )}

          <section className="settings-section">
            <h3>🎨 Theme</h3>
            <p className="settings-description">
              Choose a color scheme for your LifeClock
            </p>

            <div className="theme-grid">
              {Object.values(THEMES).map((theme) => (
                <button
                  key={theme.name}
                  className={`theme-card ${currentTheme === theme.name ? 'active' : ''}`}
                  onClick={() => onThemeChange(theme.name)}
                  onMouseEnter={() => handleThemePreview(theme.name)}
                  onMouseLeave={handleThemePreviewEnd}
                >
                  <div className="theme-preview">
                    <div
                      className="theme-color lived"
                      style={{ backgroundColor: theme.livedPrimary }}
                      aria-label={`${theme.displayName} lived color`}
                    />
                    <div
                      className="theme-color remaining"
                      style={{ backgroundColor: theme.remainingPrimary }}
                      aria-label={`${theme.displayName} remaining color`}
                    />
                  </div>
                  <div className="theme-info">
                    <div className="theme-name">{theme.displayName}</div>
                    <div className="theme-description">{theme.description}</div>
                  </div>
                  {currentTheme === theme.name && (
                    <div className="theme-check" aria-label="Selected theme">✓</div>
                  )}
                </button>
              ))}
            </div>

            <button
              className="reset-button"
              onClick={handleReset}
              disabled={currentTheme === DEFAULT_THEME}
            >
              Reset to Default Theme
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
