import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { VictoryPie } from 'victory';
import './styles.css';

export default function AvgStats() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [averageFirstCollect, setAverageFirstCollect] = useState(0);
  const [averageSecondCollect, setAverageSecondCollect] = useState(0);
  const [averageCollect, setAverageCollect] = useState(0);
  const [selectedYear, setSelectedYear] = useState('2023');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersData = async () => {
      const usersCollectionRef = collection(db, 'keepers');

      try {
        const usersQuerySnapshot = await getDocs(usersCollectionRef);
        const usersData = usersQuerySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            uid: doc.id,
            name: data.name,
            idNumber: data.idNumber,
            location: data.location,
            hiveid: data.hiveid,
            Firstcollect: data.year?.[selectedYear]?.Firstcollect || [],
            SecondCollect: data.year?.[selectedYear]?.Secondcollect || [],
          };
        });

        // Rest of your calculation logic...
        // (Keep the same calculation logic from your original file)

      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsersData();
  }, [selectedLocation, selectedYear]);

  const calculateAverage = (data) => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, num) => {
      const parsedNum = parseFloat(num);
      return isNaN(parsedNum) ? acc : acc + parsedNum;
    }, 0);
    return sum / data.length;
  };

  return (
    <div className="stats-container">
      <h1>Average Statistics</h1>
      
      <div className="stats-controls">
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
            <option key={year} value={year.toString()}>{year}</option>
          ))}
        </select>
      </div>

      <div className="stats-results">
        <div className="stat-item">
          <h3>Average First Collect</h3>
          <p>{averageFirstCollect.toFixed(2)}%</p>
        </div>
        {/* Add other stat items similarly */}
      </div>

      <Footer />
    </div>
  );
}

function Footer() {
  const navigate = useNavigate();
  
  return (
    <div className="footer">
      <button onClick={() => navigate('/colony-search')}>Colony Search</button>
      <button onClick={() => navigate('/check-messages')}>Messages</button>
      <button onClick={() => navigate('/add-participant')}>Add User</button>
      <button onClick={() => navigate('/statistics')}>Stats</button>
      <button onClick={() => navigate('/admin-info')}>Home</button>
    </div>
  );
}