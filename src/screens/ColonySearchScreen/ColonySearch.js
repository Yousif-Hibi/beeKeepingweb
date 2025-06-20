import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './styles.css';

export default function ColonySearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState([]);
  const [filterType, setFilterType] = useState('name');
  const [originalData, setOriginalData] = useState([]);
  const [nameSortOrder, setNameSortOrder] = useState('');
  const [locationSortOrder, setLocationSortOrder] = useState('');
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
          };
        });
        setUserData(usersData);
        setOriginalData(usersData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsersData();
  }, []);

  const handleUserPress = (uid) => {
    navigate(`/user-info/${uid}`);
  };

  const handleNameColumnPress = () => {
    if (nameSortOrder === 'asc') {
      const sortedData = [...userData].sort((a, b) => b.name.localeCompare(a.name));
      setUserData(sortedData);
      setNameSortOrder('desc');
    } else {
      const sortedData = [...userData].sort((a, b) => a.name.localeCompare(b.name));
      setUserData(sortedData);
      setNameSortOrder('asc');
    }
  };

  const handleLocationColumnPress = () => {
    if (locationSortOrder === 'asc') {
      const sortedData = [...userData].sort((a, b) => b.location.localeCompare(a.location));
      setUserData(sortedData);
      setLocationSortOrder('desc');
    } else {
      const sortedData = [...userData].sort((a, b) => a.location.localeCompare(b.location));
      setUserData(sortedData);
      setLocationSortOrder('asc');
    }
  };

  const handleSearch = () => {
    if (filterType === 'all') {
      setUserData(originalData);
    } else {
      const filteredData = originalData.filter((user) => {
        if (filterType === 'name') {
          return user.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filterType === 'id') {
          return user.idNumber.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filterType === 'location') {
          return user.location.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
      setUserData(filteredData);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h1 className="title">Colony Search</h1>

        <div className="search-container">
          <input
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="search-container">
          <select
            className="filter-picker"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Show All</option>
            <option value="name">Name</option>
            <option value="id">ID</option>
            <option value="location">Location</option>
          </select>
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="table-container">
          <div className="table-header">
            <div className="column-header-container" onClick={handleNameColumnPress}>
              <span className="column-header">Name</span>
              {nameSortOrder === 'asc' ? (
                <span className="sort-arrow">▲</span>
              ) : nameSortOrder === 'desc' ? (
                <span className="sort-arrow">▼</span>
              ) : (
                <span className="sort-arrow">⇵</span>
              )}
            </div>
            <span className="column-header">ID</span>
            <div className="column-header-container" onClick={handleLocationColumnPress}>
              <span className="column-header">Location</span>
              {locationSortOrder === 'asc' ? (
                <span className="sort-arrow">▲</span>
              ) : locationSortOrder === 'desc' ? (
                <span className="sort-arrow">▼</span>
              ) : (
                <span className="sort-arrow">⇵</span>
              )}
            </div>
          </div>

          {userData.map((user, index) => (
            <div
              className="table-row"
              key={index}
              onClick={() => handleUserPress(user.uid)}
            >
              <span className="column">{user.name}</span>
              <span className="column">{user.idNumber}</span>
              <span className="column">{user.location}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  const navigate = useNavigate();
  
  const handleFooterButtonPress = (path) => {
    navigate(path);
  };

  return (
    <div className="footer">
      <button className="footer-button" onClick={() => handleFooterButtonPress('/check-messages')}>
        <span className="footer-button-text">Messages</span>
      </button>
      <button className="footer-button" onClick={() => handleFooterButtonPress('/add-participant')}>
        <span className="footer-button-text">AddUser</span>
      </button>
      <button className="footer-button" onClick={() => handleFooterButtonPress('/statistics')}>
        <span className="footer-button-text">Stats</span>
      </button>
      <button className="footer-button" onClick={() => handleFooterButtonPress('/admin-info')}>
        <span className="footer-button-text">Home</span>
      </button>
    </div>
  );
}