import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './pages/styles/AgeDistributionChart.css';

const AgeDistributionChart = ({ ages }) => {
  const chartRef = useRef(null); // Reference to the chart instance

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Check if there's already a chart instance
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy(); // Destroy the previous chart
      }

      // Calculate age occurrences
      const ageCounts = countAgeOccurrences(ages);

      // Create new Chart.js instance
      chartRef.current.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(ageCounts),
          datasets: [
            {
              label: 'Age Distribution',
              data: Object.values(ageCounts),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              labels: {
                font: {
                  family: 'Arial',
                  size: 14,
                  weight: 'bold',
                },
                color: '#333',
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: {
                  family: 'Arial',
                  size: 14,
                  weight: 'bold',
                },
                color: '#333',
              },
              title: {
                display: true,
                text: 'Count',
                font: {
                  family: 'Arial',
                  size: 16,
                  weight: 'bold',
                },
                color: '#333',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Age',
                font: {
                  family: 'Arial',
                  size: 16,
                  weight: 'bold',
                },
                color: '#333',
              },
              ticks: {
                font: {
                  family: 'Arial',
                  size: 14,
                  weight: 'bold',
                },
                color: '#333',
              },
            },
          },
        },
      });
    }
  }, [ages]); // Re-render the chart when ages change

  return (
    <div className="chart-container">
      <h2 className="chart-title">Age Distribution Chart</h2>
      <canvas id="ageDistributionChart" ref={chartRef}></canvas>
    </div>
  );
};

// Function to count age occurrences
const countAgeOccurrences = (ages) => {
  return ages.reduce((acc, age) => {
    acc[age] = (acc[age] || 0) + 1;
    return acc;
  }, {});
};

export default AgeDistributionChart;
