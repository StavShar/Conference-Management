import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './pages/styles/LecturePage.css';

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
    labels: Object.keys(answerCounts), // Labels for x-axis
    datasets: [
      {
        label: titles, // Dataset label
        data: Object.values(answerCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  },
  options: {
    responsive: true,
     
    plugins: {
      legend: {
        display: true,   
        labels: {
          padding: 20,
          font: {
            family: 'Arial',
            size: 14,
            weight: 'bold',
          },
          color: '#333',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          beginAtZero: true,
          maxRotation: 0,
          align: 'center',
          autoSkip: false,
          callback: function(value) { 
            let label = this.getLabelForValue(value);
          
            // Define the maximum number of characters per line
            const maxCharsPerLine = 20;
          
            // Check if the label length exceeds the maximum characters per line
            if (label.length > maxCharsPerLine) {
              // Split the label into multiple lines by space while keeping each line within the limit
              const words = label.split(' ');
              let lines = [];
              let currentLine = '';
          
              words.forEach(word => {
                if ((currentLine + word).length <= maxCharsPerLine) {
                  currentLine += word + ' ';
                } else {
                  lines.push(currentLine.trim());
                  currentLine = word + ' ';
                }
              });
              
              // Push the last line
              if (currentLine) lines.push(currentLine.trim());
          
              return lines;
            } else {
              // If the label is within the limit, return it as is
              return label;
            }
          },
          
          font: {
            family: 'Arial',
            size: 14,
            weight: 'bold',
            
          },
          color: '#333',
          
        },
        grid: {
          display: false,
        },
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
      },
      y: {
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
        grid: {
          display: true,
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
