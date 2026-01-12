import { useEffect } from 'react';
import { THEMES, DEFAULT_THEME } from '../config/themes';
import type { ThemeName } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export function Settings({ isOpen, onClose, currentTheme, onThemeChange }: SettingsProps) {
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
          <section className="settings-section">
            <h3>Theme</h3>
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
