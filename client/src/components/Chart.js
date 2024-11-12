import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Chart = ({ workData }) => {
  const gradientFill = (context) => {
    const ctx = context.chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // White at the top
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)'); // Faded white at the bottom
    return gradient;
  };

  const data = {
    labels: workData.map((data) => data.date), // E.g., ['Mon', 'Tue', 'Wed']
    datasets: [
      {
        label: 'Work Time (hours)',
        data: workData.map((data) => data.hours),
        backgroundColor: gradientFill,
        borderWidth: 0,
        borderRadius: 10, // Rounds off the bar edges
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Focus Hours',
          font: {
            size: 16,
            weight: 'bold',
          },
          color: '#fff',
        },
        ticks: {
          color: '#fff',
          font: {
            size: 14,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
          borderDash: [5, 5],
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 16,
            weight: 'bold',
          },
          color: '#fff',
        },
        ticks: {
          color: '#fff',
          font: {
            size: 14,
          },
        },
        grid: {
          display: false, // Hides the vertical grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} hours worked`,
        },
        padding: 10,
      },
    },
  };

  return (
    <div className='chart'>
      
      <Bar data={data} options={options} />
    </div>
  );
};

export default Chart;
