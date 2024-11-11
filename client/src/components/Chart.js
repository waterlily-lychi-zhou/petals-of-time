import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 

const Chart = ({ workData }) => {
  const data = {
    labels: workData.map((data) => data.date), // E.g., ['Mon', 'Tue', 'Wed']
    datasets: [
      {
        label: 'Work Time (hours)',
        data: workData.map((data) => data.hours),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Day',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} hours worked`,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default Chart;
