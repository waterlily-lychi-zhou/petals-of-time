import React from 'react';

function Break ({ timeLeft, isCounting, toggleTimer, restartTimer }) {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <div>
      <h1 className="work-timer">{formatTime(timeLeft)}</h1>
      <button className="work-toggle-button" onClick={toggleTimer}>
        {isCounting ? 'Pause' : 'Start'}
      </button>

      <button className="work-restart-button" onClick={() => restartTimer()}>
        End Break
      </button>

    </div>
  )
}

export default Break;