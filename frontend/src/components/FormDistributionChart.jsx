import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './pages/styles/FormDistributionChart.css';

const FormDistributionChart = ({ title, titles, answersData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const answerCounts = countAnswerOccurrences(answersData);

      chartRef.current.chart = new Chart(ctx, {
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
          plugins: {
            legend: {
              labels: {
                font: {
                  family: 'Arial',
                  size: 16,
                  weight: 'bold',
                },
                color: '#333',
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Answers',
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
                  size: 16,
                  weight: 'bold',
                },
                color: '#333',
              },
            },
            y:  {
              title: {
                display: true,
                text: 'Answers',
                font: {
                  family: 'Arial',
                  size: 16,
                  weight: 'bold',
                },
                color: '#333',
              },
              ticks: {
                stepSize: 1,
                font: {
                  family: 'Arial',
                  size: 16,
                  weight: 'bold',
                },
                color: '#333',
              },
            },
          },
        },
      });
    }
  }, [answersData]);

  return (
    <div className="chart-container">
      {<h2 className="chart-title">{titles}</h2>} 
      <canvas id="formDistributionChart" ref={chartRef}></canvas>
    </div>
  );
};

const countAnswerOccurrences = (answers) => {
  return answers.reduce((acc, answer) => {
    acc[answer] = (acc[answer] || 0) + 1;
    return acc;
  }, {});
};

export default FormDistributionChart;
