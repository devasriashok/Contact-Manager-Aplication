// src/pages/DataVisualization.js
import React, { useContext, useState } from 'react';
import { ContactContext } from '../context/ContactContext';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './Datavisualization.css';

function DataVisualization() {
  const { contacts } = useContext(ContactContext);
  const [chartType, setChartType] = useState('bar'); // State for chart type

  // Prepare data for visualization based on contact types
  const prepareVisualizationData = () => {
    const dataCounts = {};

    // Count the number of contacts per type
    Object.keys(contacts).forEach((type) => {
      dataCounts[type] = (contacts[type] || []).length;
    });

    return {
      labels: Object.keys(dataCounts), // Contact types
      dataCounts: Object.values(dataCounts), // Counts for each type
    };
  };

  const visualizationData = prepareVisualizationData();

  if (!visualizationData || visualizationData.labels.length === 0) {
    return <p>No available contacts for visualization.</p>;
  }

  const chartData = {
    labels: visualizationData.labels,
    datasets: [
      {
        label: 'Number of Contacts per Type',
        data: visualizationData.dataCounts,
        backgroundColor: [
          '#3b82f6', '#f97316', '#10b981', '#f43f5e', '#8b5cf6'
        ],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: chartType === 'bar' ? {
      x: {
        title: { display: true, text: 'Contact Types' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Contacts' },
      },
    } : {},
  };

  // Function to handle chart download as PNG
  const downloadChart = () => {
    const chartElement = document.querySelector('canvas');
    if (chartElement) {
      const image = chartElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'contact-visualization.png';
      link.click();
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="visualization-container">
      <h2 className="visualization-title">Data Visualization</h2>

      {/* Toggle buttons for chart types */}
      <div className="chart-toggle-buttons">
        <button onClick={() => setChartType('bar')}>Bar Chart</button>
        <button onClick={() => setChartType('pie')}>Pie Chart</button>
        <button onClick={() => setChartType('doughnut')}>Doughnut Chart</button>
        <button onClick={downloadChart}>Download Chart</button>
      </div>

      {/* Render the chart */}
      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
  );
}

export default DataVisualization;
