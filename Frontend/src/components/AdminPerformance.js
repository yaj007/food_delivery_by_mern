// AdminPerformance.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale as ChartCategoryScale, LinearScale as ChartLinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, ChartCategoryScale, ChartLinearScale, BarElement, ChartTitle, Tooltip, Legend);

function AdminPerformance() {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:3001/admin/performance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError('Failed to fetch performance data');
    } finally {
      setLoading(false);
    }
  };

  const userChartData = {
    labels: ['New Users', 'Existing Users'],
    datasets: [
      {
        data: performanceData ? [
          performanceData.userMetrics.new,
          performanceData.userMetrics.total - performanceData.userMetrics.new
        ] : [0, 0],
        backgroundColor: [
          'rgba(20, 184, 166, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgb(20, 184, 166)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const popularItemsData = {
    labels: performanceData?.popularItems.map(item => item.name) || [],
    datasets: [
      {
        label: 'Orders',
        data: performanceData?.popularItems.map(item => item.count) || [],
        backgroundColor: 'rgba(20, 184, 166, 0.8)',
      },
    ],
  };

  const popularItemsOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Most Popular Items'
      },
    },
  };

  return (
    <div className="bg-gray-800 dark:bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-teal-400 dark:text-teal-600">Performance Metrics</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading performance data...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
              <h3 className="text-lg text-gray-300 dark:text-gray-600 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-teal-400 dark:text-teal-600">
                {performanceData.userMetrics.total}
              </p>
            </div>
            <div className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
              <h3 className="text-lg text-gray-300 dark:text-gray-600 mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-500">
                {performanceData.orderMetrics.total}
              </p>
            </div>
            <div className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
              <h3 className="text-lg text-gray-300 dark:text-gray-600 mb-2">Avg. Order Value</h3>
              <p className="text-3xl font-bold text-yellow-500">
                ${performanceData.orderMetrics.avgValue.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
              <h3 className="text-lg text-center text-gray-300 dark:text-gray-600 mb-4">User Distribution</h3>
              <div className="h-64 flex justify-center">
                <Doughnut data={userChartData} />
              </div>
            </div>
            
            <div className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
              <h3 className="text-lg text-center text-gray-300 dark:text-gray-600 mb-4">Popular Items</h3>
              <div className="h-64">
                <Bar data={popularItemsData} options={popularItemsOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPerformance;