import './App.css';
import Work from './containers/Work';
import Break from './containers/Break';
import LotusCount from './components/LotusCount';
import StatusIndicator from './components/StatusIndicator';
import Settings from './components/Settings';
import SettingsButton from './components/SettingsButton';
import Chart from './components/Chart';
import React, { useState, useEffect } from 'react';

function App() {
  const [workPeriod, setWorkPeriod] = useState(0.1 * 60);
  const [breakPeriod, setBreakPeriod] = useState(0.1 * 60);
  const [longRest, setLongRest] = useState(0.1 * 60);
  const [sessionCount, setSessionCount] = useState(2);

  const [timeLeft, setTimeLeft] = useState(workPeriod);
  const [isCounting, setIsCounting] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [lotusCount, setLotusCount] = useState(0);
  const [isTransition, setIsTransition] = useState(false);
  const [tranIsPaused, setTranIsPaused] = useState(false);
  const [tranTime, setTranTime] = useState(5);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date().toISOString().split('T')[0]);
  const [workHoursData, setWorkHoursData] = useState([]);

  const apiEndpoint = 'http://localhost:5001';
  
  // Fetch settings from the backend when the component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/settings`);
        const settings = await response.json();
        if (settings) {
          setWorkPeriod(settings.work_period);
          setBreakPeriod(settings.break_period);
          setLongRest(settings.long_rest);
          setSessionCount(settings.session_count);
          setTimeLeft(settings.work_period);
        }
      } catch (e) {
        console.error('Error fetching settings:', e);
      }
    }
    fetchSettings();
  }, []);

  // Fetch work hours data from the backend to display the chart
  useEffect(() => {
    const fetchWorkHours = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/work-hours`);
        const data = await response.json();
        setWorkHoursData(data.map((entry) => ({
          date: entry.date,
          hours: entry.work_time / 60,
        })))
      } catch (e) {
        console.error('Error fetching work hours:', e);
      }
    }
    fetchWorkHours();
  }, [lotusCount])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastUpdateDate !== today) {
      setLotusCount(0);
      setLastUpdateDate(today);
    }
  }, [lastUpdateDate]);

  // handles changes made in Settings. It's called whenevery new settings are saved.
  const handleSettingsChange = async (newSettings) => {
    try {
      await fetch(`${apiEndpoint}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      const newWorkPeriod = newSettings.workPeriod * 60;
      const newBreakPeriod = newSettings.breakPeriod * 60;
      const newLongRest = newSettings.longRest * 60;
      
      setWorkPeriod(newWorkPeriod);
      setBreakPeriod(newBreakPeriod);
      setLongRest(newLongRest);
      setSessionCount(newSettings.sessionCount);
    
      // Update `timeLeft` immediately when settings change
      setTimeLeft(isWorkSession ? newWorkPeriod : newBreakPeriod);
    } catch (e) {
    console.error('Error updating settings:', e);
  }
  }

  const recordWorkSession = async (workMinutes) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      await fetch(`${apiEndpoint}/work-hours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: today,
          workTime: workMinutes,
          completedSessions: 1,
        }),
      });
    } catch (error) {
      console.error('Error recording work hours:', error);
    }
  };

/*   // Reset lotus count at the start of a new day
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastUpdateDate !== today) {
      setLotusCount(0);
      setLastUpdateDate(today);
    }
  }, [lastUpdateDate]); */

  // the work or break countdown (25min, 5min)
  useEffect(() => {
    let timer;
    if (isCounting && timeLeft > 0) { // counting: every 1 sec, time - 1
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) { // countdown finish
      setIsCounting(false);
      setIsTransition(true);
      setTranTime(5);
      if (isWorkSession) {
        recordWorkSession(workPeriod/60);
        setLotusCount(prevCount => prevCount + 1); // if work countdown, add 1 lotus
        setCompletedSessions(prevSessions => prevSessions + 1); // add 1 completed session
      }
    } 
    return () => clearTimeout(timer);
  }, [isCounting, timeLeft, isWorkSession]);

  // the transition countdown (5s)
  useEffect(() => {
    let tranTimer;
    if (isTransition && tranTime > 0 && !tranIsPaused) { // transition counting
      tranTimer = setTimeout(() => {
        setTranTime(preTime => preTime - 1);
      }, 1000);
    } else if (tranTime === 0 && isTransition) {
      setIsTransition(false);
      if (isWorkSession) {
        if (completedSessions < sessionCount) { // Check if completed enough sessions to take a long break
          setIsWorkSession(false);
          setTimeLeft(breakPeriod);
        } else {
          setIsWorkSession(false);
          setTimeLeft(longRest);  
          setCompletedSessions(0);
        } 
      } else {
        setIsWorkSession(true);
        setTimeLeft(workPeriod);
      } 
    }
    return () => clearTimeout(tranTimer);
  }, [tranTime, isTransition, tranIsPaused, isWorkSession, workPeriod, breakPeriod, longRest, completedSessions, sessionCount ]);

  const toggleTimer = () => {
    setIsCounting(!isCounting);
  };

  const pauseTran = () => {
    setTranIsPaused(prevState => !prevState);
  }

  const restartTimer = () => {
    setIsWorkSession(true);
    setTimeLeft(workPeriod);
    setIsCounting(false);
    setTranIsPaused(false);
    setIsTransition(false);
  }


  return (
    <div className="App">
      <SettingsButton toggleSettings={() => setIsSettingsOpen(prevState => !prevState)} />
      {isSettingsOpen ? (
        <Settings 
        onSettingsChange={handleSettingsChange} 
        closeSettings={() => setIsSettingsOpen(false)} 
        />
      ) : (
      <div>
        <LotusCount lotusCount={lotusCount} />
        <div className="main">
          {isTransition ? (
            <StatusIndicator 
              isWorkSession={isWorkSession}
              pauseTran={pauseTran}
              tranTime={tranTime}
              tranIsPaused={tranIsPaused}
            />
          ) : isWorkSession ? (
            <Work 
              timeLeft={timeLeft} 
              isCounting={isCounting} 
              toggleTimer={toggleTimer} 
              restartTimer={restartTimer} 
            />
          ) : (
            <Break 
              timeLeft={timeLeft} 
              isCounting={isCounting} 
              toggleTimer={toggleTimer} 
              restartTimer={restartTimer}/>
          )}
        </div>
        <Chart workData={workHoursData} />
      </div>

      )
      }

    </div>
  );
}

export default App;