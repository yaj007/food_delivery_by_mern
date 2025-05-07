import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AdminEarningsReport() {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchEarningsData();
  }, [period]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`http://localhost:3001/admin/earnings?period=${period}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEarningsData(response.data);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      setError('Failed to fetch earnings data');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: earningsData?.data.map(item => item.date) || [],
    datasets: [
      {
        label: 'Earnings ($)',
        data: earningsData?.data.map(item => item.earnings) || [],
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.5)',
        tension: 0.3
      },
      {
        label: 'Orders',
        data: earningsData?.data.map(item => item.orders) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Earnings ($)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Number of Orders'
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Earnings & Orders Report'
      },
    },
  };

  return (
    <div className="bg-gray-800 dark:bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-teal-400 dark:text-teal-600">Earnings Report</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-4 py-2 rounded-lg ${period === 'daily' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-700 dark:bg-gray-200 text-gray-300 dark:text-gray-800'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-4 py-2 rounded-lg ${period === 'weekly' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-700 dark:bg-gray-200 text-gray-300 dark:text-gray-800'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-2 rounded-lg ${period === 'monthly' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-700 dark:bg-gray-200 text-gray-300 dark:text-gray-800'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('yearly')}
              className={`px-4 py-2 rounded-lg ${period === 'yearly' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-700 dark:bg-gray-200 text-gray-300 dark:text-gray-800'}`}
            >
              Yearly
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading earnings data...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
                <h3 className="text-lg text-gray-300 dark:text-gray-600 mb-2">Total Earnings</h3>
                <p className="text-3xl font-bold text-teal-400 dark:text-teal-600">
                  ${earningsData?.totalEarnings.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
                <h3 className="text-lg text-gray-300 dark:text-gray-600 mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-blue-500">
                  {earningsData?.totalOrders}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
              <Line data={chartData} options={chartOptions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminEarningsReport;