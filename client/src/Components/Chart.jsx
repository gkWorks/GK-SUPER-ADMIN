import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Today', 'Yesterday', 'Tomorrow', 'Last Month'],
  datasets: [
    {
      data: [300, 50, 100, 150],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#2ECC71'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#2ECC71'],
    },
  ],
};

const ChartCard = ({ heading, fields }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  return (
    <div className="w-full sm:w-1/2 p-2">
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{heading}</h2>
          <div className="text-sm text-gray-400">
            {date} &nbsp; {currentTime}
          </div>
        </div>
        <div className="flex w-full mb-4">
          <Pie data={data} />
        </div>
        <div className="w-full">
          {fields.map((field, index) => (
            <div key={index} className="flex justify-between mt-4">
              <div className="text-gray-500">{field.name}</div>
              <div className="text-gray-500">{field.value}</div>
              <div
                className={`h-2 rounded-full mt-2 ${['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'][index]}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
