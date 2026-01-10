import { useState, useCallback } from 'react';
import { UserInputForm } from './components/UserInputForm';
import { TimeLived } from './components/TimeLived';
import { TimeRemaining } from './components/TimeRemaining';
import { LifeTimeline } from './components/LifeTimeline';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLifeExpectancy } from './hooks/useLifeExpectancy';
import { useTimeDifference } from './hooks/useTimeDifference';
import { isOverLifeExpectancy } from './utils/timeCalculations';
import type { UserData, StoredUserData } from './types';
import './App.css';

function App() {
  const [storedData, setStoredData] = useLocalStorage<StoredUserData | null>(
    'lifeclock-user-data',
    null
  );
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>LifeClock</h1>
        <p className="tagline">Every second counts. Make them matter.</p>
      </header>

      <main className="app-main">
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
    </div>
  );
}

export default App;
