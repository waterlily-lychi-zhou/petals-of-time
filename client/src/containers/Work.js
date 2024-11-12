import React from 'react';
import clickSound from '../assets/click-sound.wav';

function Work ({ timeLeft, isCounting, toggleTimer, restartTimer}) {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const playSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  }

  const handleClick = () => {
    playSound();
    toggleTimer();
  }

  return (
    <div className='work-timer'>
      <h1>{formatTime(timeLeft)}</h1>
      <button className="work-toggle-button" onClick={handleClick}>
        {isCounting ? 'Pause' : 'Start'}
      </button>
{/*       <button className="work-restart-button" onClick={() => { toggleTimer(); restartTimer();}}>
        Restart
      </button> */}
    </div>
  )
}

export default Work;