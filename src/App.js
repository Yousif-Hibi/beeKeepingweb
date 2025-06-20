import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import Home from './screens/HomeScreen/Home';
import AdminInfo from './screens/AdminInfoScreen/AdminInfo';
import AddParticipant from './screens/AddParticipantScreen/AddParticipant';
import CheckMessages from './screens/CheckMessagesScreen/CheckMessages';
import CheckerInfo from './screens/CheckerInfoScreen/CheckerInfo';
import ColonySearch from './screens/ColonySearchScreen/ColonySearch';
import Statistics from './screens/StatisticsScreen/Statistics';
import ColAccIInfo from './screens/ColAccInfoScreen/ColAccIInfo';
import Chat from './screens/ChatScreen/Chat';
import UserInfo from './screens/UserInfoScreen/UserInfo';
import EditUser from './screens/EditUserScreen/EditUser';
import UserCheckMessages from './screens/UserCheckMassagesScreen/UserCheckMassages';
import CityStatistics from './screens/CityStatisticsScreen/CityStatistics';
import CityStats from './screens/CityStatsScreen/CityStats';
import AvgStats from './screens/AvgStatsScreen/AvgStats';

const firebaseConfig = {
  apiKey: "AIzaSyBDxWaOapX03TXYUWDrxlJ3caiApknK3o0",
  authDomain: "beekeeping-8f7e6.firebaseapp.com",
  projectId: "beekeeping-8f7e6",
  storageBucket: "beekeeping-8f7e6.appspot.com",
  messagingSenderId: "43486883566",
  appId: "1:43486883566:web:b512c45d93113b91548dff",
  measurementId: "G-SZ0PL1ERZG",
};
initializeApp(firebaseConfig);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-info" element={<AdminInfo />} />
        <Route path="/checker-info" element={<CheckerInfo />} />
        <Route path="/colony-search" element={<ColonySearch />} />
        <Route path="/check-messages" element={<CheckMessages />} />
        <Route path="/add-participant" element={<AddParticipant />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/col-acc-info/:uid" element={<ColAccIInfo />} />
        <Route path="/chat/:uid" element={<Chat />} />
        <Route path="/user-info/:uid" element={<UserInfo />} />
        <Route path="/edit-user/:uid" element={<EditUser />} />
        <Route path="/user-check-messages" element={<UserCheckMessages />} />
        <Route path="/city-statistics" element={<CityStatistics />} />
        <Route path="/city-stats" element={<CityStats />} />
        <Route path="/avg-stats" element={<AvgStats />} />
      </Routes>
    </Router>
  );
}