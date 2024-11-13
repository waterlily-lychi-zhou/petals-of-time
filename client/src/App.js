import './App.css';
import Work from './containers/Work';
import Break from './containers/Break';
import LotusCount from './components/LotusCount';
import StatusIndicator from './components/StatusIndicator';
import Settings from './components/Settings';
import SettingsButton from './components/SettingsButton';
import Chart from './components/Chart';
import ChartButton from './components/ChartButton'; 
import ReturnButton from './components/ReturnButton';
import TomatoIcon from './components/TomatoIcon';
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [workPeriod, setWorkPeriod] = useState(1 * 60);           // focus time period
  const [breakPeriod, setBreakPeriod] = useState(1 * 60);         // break time period
  const [longRest, setLongRest] = useState(5 * 60);               // long rest time period
  const [sessionCount, setSessionCount] = useState(4);            // sessions before long rest
  const [timeLeft, setTimeLeft] = useState(workPeriod);           // timeLeft for timer

  const [isCounting, setIsCounting] = useState(false);            // timer is counting
  const [isWorkSession, setIsWorkSession] = useState(true);       // work timer or break timer
  const [lotusCount, setLotusCount] = useState(0);                // session completed for the day
  const [completedSessions, setCompletedSessions] = useState(0);  // session completed for the day

  const [isTransition, setIsTransition] = useState(false);        // on/off state for transition page
  const [tranIsPaused, setTranIsPaused] = useState(false);        // pause button in transition page
  const [tranTime, setTranTime] = useState(5);                    // transition time

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);    // on/off state for Settings page
  const [isChartOpen, setIsChartOpen] = useState(false);          // on/off state for Chart page

  const [lastUpdateDate, setLastUpdateDate] = useState(new Date().toISOString().split('T')[0]);   // last updated date for chart data
  const [workHoursData, setWorkHoursData] = useState([]);         // work data for chart
  const [tomatoIcons, setTomatoIcons] = useState([]);             // tomato array for session achievements

  const apiEndpoint = 'http://localhost:5001';

  // Add a ref to track whether a session was completed

  // Fetch settings from the backend when the component mounts
  // Update timer if settings parameters changed
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/settings`);
        let settings = await response.json();
        settings = settings[-1];
        // TODO: Try console.log more.
        // TODO: Be cautious about data type.
        if (settings) {
          setWorkPeriod(settings.work_period);
          setBreakPeriod(settings.break_period);
          setLongRest(settings.long_rest);
          setSessionCount(settings.session_count);
          setTimeLeft(settings.work_period);
          console.log(settings);
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
      if (isChartOpen) {
        try {
          const response = await fetch(`${apiEndpoint}/work-hours`);
          const data = await response.json();
          setWorkHoursData(data.map((entry) => ({
            date: entry.date,                      // date of work record
            hours: entry.work_time / 60,           // work hours in that date
          })))
        } catch (e) {
          console.error('Error fetching work hours:', e);
        }
      }
    }
    fetchWorkHours();
  }, [isChartOpen, lotusCount])

  // For a new day, clear the tomato data, set date as today.
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastUpdateDate !== today) {
      setLotusCount(0);
      /* setTomatoIcons([]); */
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
          work_time: workMinutes,
          completed_sessions: 1,
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
  const lotusCountRef = useRef(0);
    // Add tomato icon at a random position at the bottom of the page
  const addTomatoIcon = () => {
    const randomX = Math.random() * 90; // Random position within 90% of the width
    const newTomato = {
      id: lotusCount,
      left: `${randomX}%`,
    };
    setTomatoIcons((prevIcons) => [...prevIcons, newTomato]);
  };

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
        /* setLotusCount(prevCount => prevCount + 1); // if work countdown, add 1 lotus */
        setLotusCount(prevCount =>  prevCount + 1);
        addTomatoIcon();
        setCompletedSessions(prevSessions => prevSessions + 1); // add 1 completed session
      }
    } 
    return () => clearTimeout(timer);
  }, [isCounting, timeLeft, isWorkSession]);

/*   // Watch for lotusCount change to add tomato icon
  useEffect(() => {
    if (lotusCountRef.current !== lotusCount) {
      addTomatoIcon();
      lotusCountRef.current = lotusCount;
    }
  }, [lotusCount]); */

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

  // tag work or break session to the body, to make the body changes colors
  useEffect(() => {
    document.body.classList.toggle('work-session', isWorkSession);
    document.body.classList.toggle('break-session', !isWorkSession);
  }, [isWorkSession]);

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

  const backToHome = () => {
    setIsSettingsOpen(false);
    setIsChartOpen(false)
  }

  return (
    <div className={`App ${isWorkSession ? 'work-session' : 'break-session'}`}>
      {(isSettingsOpen || isChartOpen) ? (<ReturnButton backToHome={backToHome} />) : null }
      <SettingsButton toggleSettings={() => setIsSettingsOpen(prevState => !prevState)} />
      <ChartButton toggleChart={() => setIsChartOpen(prevState => !prevState)} />
      {isSettingsOpen ? (
        <Settings 
          onSettingsChange={handleSettingsChange} 
          closeSettings={() => setIsSettingsOpen(false)} 
        />
      ) : isChartOpen ? (
        <Chart workData={workHoursData} />
      ) : (
        <div>
          {/* <LotusCount lotusCount={lotusCount} /> */}
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
                restartTimer={restartTimer}
              />
            )}
          </div>
          {tomatoIcons.map((tomato) => (
            <TomatoIcon key={tomato.id} left={tomato.left} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;