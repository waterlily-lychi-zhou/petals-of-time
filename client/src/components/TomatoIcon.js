import React from 'react';
import tomatoIcon from '../assets/tomato.png';  // Import CSS styles for the dropping animation

const TomatoIcon = ({ left }) => {
  return (
    <div className="tomato-icon" style={{ left }}>
      <img
        src={tomatoIcon}
        alt="Tomato Icon"
        className="tomatos-icon"
      />
    </div>
  );
};

export default TomatoIcon;