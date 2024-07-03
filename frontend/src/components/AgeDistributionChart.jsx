import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

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
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
            x: {
              title: {
                display: true,
                text: 'Age',
              },
            },
          },
        },
      });
    }
  }, [ages]); // Re-render the chart when ages change

  return (
    <div className="chart-container">
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
