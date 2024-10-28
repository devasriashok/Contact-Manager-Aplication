// src/pages/DataVisualization.js
import React, { useContext } from 'react';
import { ContactContext } from '../context/ContactContext';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import for chart support
import './Datavisualization.css';
function DataVisualization() {
  const { contacts } = useContext(ContactContext);

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

  // Check if visualizationData exists
  if (!visualizationData || visualizationData.labels.length === 0) {
    return <p>No available contacts for visualization.</p>;
  }

  const chartData = {
    labels: visualizationData.labels,
    datasets: [{
      label: 'Number of Contacts per Type',
      data: visualizationData.dataCounts,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Contact Types',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Contacts',
        },
      },
    },
  };

  return (
    <div>
      <h2>Data Visualization</h2>
      {/* Render the bar chart */}
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default DataVisualization;
