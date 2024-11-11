import React from 'react';

function StatusIndicator({ isWorkSession, pauseTran, tranTime, tranIsPaused }) {
  return (
    <div>
      {isWorkSession ? (
        <div>
          <p>Great Work!</p>
          <p>🪷 + 1</p>
          <button onClick={() => pauseTran()}>{tranIsPaused ? 'Resume' : 'Pause'}</button>
          <p>Take a break in {tranTime} seconds...</p>
        </div>
      ) : (
        <div>
          <p>Break is Over!</p>
          <button onClick={() => pauseTran()}>{tranIsPaused ? 'Resume' : 'Pause'}</button>
          <p>Resume focus in {tranTime} seconds...</p>
        </div>
      )}
    </div>
  );
}

export default StatusIndicator;
