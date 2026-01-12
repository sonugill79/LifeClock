import { useState, useCallback } from 'react';
import { differenceInYears } from 'date-fns';
import { UserInputForm } from './components/UserInputForm';
import { TimeLived } from './components/TimeLived';
import { TimeRemaining } from './components/TimeRemaining';
import { LifeTimeline } from './components/LifeTimeline';
import { Settings } from './components/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLifeExpectancy } from './hooks/useLifeExpectancy';
import { useTimeDifference } from './hooks/useTimeDifference';
import { useTheme } from './hooks/useTheme';
import { isOverLifeExpectancy } from './utils/timeCalculations';
import type { UserData, StoredUserData } from './types';
import './App.css';

function App() {
  const [storedData, setStoredData] = useLocalStorage<StoredUserData | null>(
    'lifeclock-user-data',
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Parse stored data to UserData format
  const userData: UserData = storedData
    ? {
        birthday: new Date(storedData.birthday),
        gender: storedData.gender,
        country: storedData.country,
      }
    : {
        birthday: null,
        gender: null,
        country: null,
      };

  const lifeExpectancy = useLifeExpectancy(userData.country, userData.gender);
  const { timeLived, timeRemaining, currentTime } = useTimeDifference(
    userData.birthday,
    lifeExpectancy
  );

  const isOver = userData.birthday && lifeExpectancy
    ? isOverLifeExpectancy(userData.birthday, lifeExpectancy, currentTime)
    : false;

  const handleFormSubmit = useCallback(
    (data: UserData) => {
      if (!data.birthday || !data.gender || !data.country) {
        return;
      }

      const dataToStore: StoredUserData = {
        birthday: data.birthday.toISOString(),
        gender: data.gender,
        country: data.country,
        lastUpdated: new Date().toISOString(),
      };

      setStoredData(dataToStore);
      setIsEditing(false);
    },
    [setStoredData]
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const hasData = storedData !== null;
  const showForm = !hasData || isEditing;

  // Calculate age and format birthday for the badge
  const age = userData.birthday ? differenceInYears(new Date(), userData.birthday) : null;
  const formattedBirthday = userData.birthday
    ? userData.birthday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          {/* User Info Badge - only show when user has data */}
          {hasData && age !== null && (
            <button
              className="user-info-badge"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Edit your profile"
            >
              <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="user-info-text">
                <span className="user-age">Age {age}</span>
                <span className="user-birthday-separator"> · </span>
                <span className="user-birthday">{formattedBirthday}</span>
              </span>
              <svg className="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          <div className="header-title">
            <h1>LifeClock</h1>
            <p className="tagline">Visualize your time</p>
          </div>

          <button
            className="settings-button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings"
          >
            <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      <main id="main-content" className="app-main">
        {showForm ? (
          <UserInputForm onSubmit={handleFormSubmit} initialData={hasData ? userData : undefined} />
        ) : (
          <>
            <div className="clocks-container">
              {timeLived && <TimeLived time={timeLived} />}
              {timeRemaining && <TimeRemaining time={timeRemaining} isOverExpectancy={isOver} />}
            </div>

            {/* Life Timeline Grid */}
            {userData.birthday && lifeExpectancy && (
              <LifeTimeline
                birthday={userData.birthday}
                currentTime={currentTime}
                lifeExpectancy={lifeExpectancy}
              />
            )}

            <div className="actions">
              <button onClick={handleEdit} className="edit-button">
                Edit Details
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Life expectancy data based on WHO statistics</p>
      </footer>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        userData={userData}
        onUserDataChange={handleFormSubmit}
      />
    </div>
  );
}

export default App;
