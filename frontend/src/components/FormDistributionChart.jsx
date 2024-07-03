import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Import Chart.js directly

const FormDistributionChart = ({ titles ,answersData }) => {
  const chartRef = useRef(null); // Reference to the chart canvas

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy(); // Destroy the previous chart instance
      }
      const ctx = chartRef.current.getContext('2d');
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(answerCounts),
          datasets: [
            {
              label: titles,
              data: Object.values(answerCounts),
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
                text: 'Answers',
              },
            },
          },
        },
      });
      chartRef.current.chart = newChartInstance; // Save the new chart instance to the ref
    }
  }, [answersData]); // Re-render the chart when answersData changes

  // Count occurrences of each answer
  const countAnswerOccurrences = (answers) => {
    const counts = {};
    answers.forEach((answer) => {
      if (counts[answer]) {
        counts[answer]++;
      } else {
        counts[answer] = 1;
      }
    });
    return counts;
  };

  const answerCounts = countAnswerOccurrences(answersData); // Calculate answer counts

  return (
    <div>
      <canvas id="answersDistributionChart" ref={chartRef}></canvas>
    </div>
  );
};

export default FormDistributionChart;
