import React from 'react';
import { FaRegChartBar } from "react-icons/fa";
/* import chartIcon from '../assets/chart.png';  */


function ChartButton({ toggleChart }) {
  return (
    <div>
      <button className='chart-button' onClick={toggleChart}>
      <FaRegChartBar style={{ color: 'white', fontSize: '24px' }}/>
{/*         <img
          src={chartIcon}
          alt="Chart Icon"
          className="chart-icon"
        /> */}
     </button>
    </div>
  );
}

export default ChartButton;
