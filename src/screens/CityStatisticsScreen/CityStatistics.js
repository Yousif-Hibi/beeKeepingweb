import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { VictoryPie } from 'victory';
import "./styles.css"

export default function CityStatistics() {
  const [cityData, setCityData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const usersCollectionRef = collection(db, 'keepers');
        const usersQuerySnapshot = await getDocs(usersCollectionRef);

        const cityCounts = {};
        usersQuerySnapshot.forEach((doc) => {
          const city = doc.data().location;
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        });

        const cityData = Object.entries(cityCounts).map(([city, count]) => ({
          city,
          count,
        }));

        setCityData(cityData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCityData();
  }, []);

  return (
    <div className="city-stats-container">
      <h1>Keepers Population</h1>
      
      <div className="chart-container">
        <VictoryPie
          data={cityData}
          x="city"
          y="count"
          colorScale={["#FF3E3E", "#FF9F1C", "#FFCD3C", "#8BE84B", "#27AE60"]}
          labels={({ datum }) => `${datum.city}: ${datum.count}`}
        />
      </div>
      
      <div className="legend-container">
        {cityData.map(({ city, count }) => (
          <div key={city} className="legend-item">
            <span className="city-name">{city}</span>
            <span className="city-count">{count}</span>
          </div>
        ))}
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