import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

import {
  Chart as ChartJS,
  ChartOptions,
  BarElement,
  LinearScale,
} from 'chart.js';
import { CategoryScale } from 'chart.js';
import { getError } from '../utils';
import { Store } from '../store';
import { Link } from 'react-router-dom';

ChartJS.register(BarElement, LinearScale);
ChartJS.register(CategoryScale);

const DashboardScreen: React.FC = () => {
  const [usersData, setUsersData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users`,
          {
            headers: { Authorization: `${userInfo!.token}` },
          }
        );
        const sortedData = sortUserDataByMonth(data);
        const monthlyCounts = countUsersPerMonth(sortedData);
        setUsersData(monthlyCounts);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(getError(err));
      }
    };
    getData();
  }, [userInfo]);

  const sortUserDataByMonth = (userData: any[]) => {
    return userData.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  };

  const countUsersPerMonth = (userData: any[]) => {
    const counts = new Array(12).fill(0);
    userData.forEach((user) => {
      const month = new Date(user.createdAt).getMonth();
      counts[month]++;
    });
    return counts;
  };

  const data = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Number of Users',
        data: usersData,
        backgroundColor: 'rgba(155, 179, 132, 0.2)',
        borderColor: '#74866e',
        textColor: '#4c5748',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        type: 'category',
      },
    },
  };

  const sum = usersData.reduce((acc, curr) => acc + curr, 0);
  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 text-green-300">
      <Link
        to={'/'}
        className="flex flex-row justify-center items-center text-3xl"
      >
        BookPedia
      </Link>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg max-sm:text-base font-bold mb-2">
          DashBoard <span className="px-2"></span>Total Users: {sum}
        </h2>
        <div className="flex items-center">
          <FaUser className="mr-2" />
          <p className="text-lg max-sm:text-base font-bold m-0.5">
            {userInfo!.name}
          </p>
        </div>
      </div>
      {loading ? (
        <div className="h-screen p-8 bg-black text-green-300 flex items-center justify-center">
          Loading...
        </div>
      ) : error ? (
        <div className="h-screen p-8 bg-black text-green-300 flex items-center justify-center">
          {error}
        </div>
      ) : (
        <div className="max-h-screen">
          <div className="border-2 border-green-300 rounded-lg p-4 bg-black text-green-300 h-full">
            <Bar
              data={data}
              options={options}
              width={window.innerWidth * 0.8}
              height={window.innerHeight * 0.8}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
