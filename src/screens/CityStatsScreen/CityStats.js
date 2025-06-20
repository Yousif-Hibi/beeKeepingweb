import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
} from "victory";
import Select from "react-select";
import "./style.css";

export default function CityStats() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [averageFirstCollect, setAverageFirstCollect] = useState(0);
  const [averageSecondCollect, setAverageSecondCollect] = useState(0);
  const [averageCollect, setAverageCollect] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2023");

  const cities = [
    { value: "", label: "All Cities" },
    { value: "Old City / البلدة القديمة", label: "Old City / البلدة القديمة" },
    { value: "ras al amood / رأس العامود", label: "ras al amood / رأس العامود" },
    { value: "Beit Hanina / بيت حنينا", label: "Beit Hanina / بيت حنينا" },
    { value: "Shuafat / شعفاط", label: "Shuafat / شعفاط" },
    { value: "Silwan / سلوان", label: "Silwan / سلوان" },
    { value: "Issawiya / العيسوية", label: "Issawiya / العيسوية" },
    { value: "Jabal Mukaber / جبل المكبر", label: "Jabal Mukaber / جبل المكبر" },
    { value: "Beit Safafa / بيت صفافا", label: "Beit Safafa / بيت صفافا" },
    { value: "Abu Tor / ثوري", label: "Abu Tor / ثوري" },
    { value: "Al Toor / الطور", label: "Al Toor / الطور" },
    { value: "Em toba / ام طوبة", label: "Em toba / ام طوبة" },
    { value: "Wadi el joz / وادي الجوز", label: "Wadi el joz / وادي الجوز" },
    { value: "Abu des / أبو ديس", label: "Abu des / أبو ديس" },
    { value: "Al Eizareya / العيزرية", label: "Al Eizareya / العيزرية" },
    { value: "Anata / مخيم أناتا", label: "Anata / مخيم أناتا" },
    { value: "Zeayem / زعيم", label: "Zeayem / زعيم" },
    { value: "Kofor Akab / كفر عقب", label: "Kofor Akab / كفر عقب" },
  ];

  const years = [
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
    { value: "2028", label: "2028" },
    { value: "2029", label: "2029" },
    { value: "2030", label: "2030" },
  ];

  useEffect(() => {
    const fetchUsersData = async () => {
      const usersCollectionRef = collection(db, "keepers");

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

        const filteredData = selectedLocation
          ? usersData.filter((user) => user.location === selectedLocation)
          : usersData;

        const allFirstCollectData = filteredData.flatMap(
          (user) => user.Firstcollect
        );

        const allSecondCollectData = filteredData.flatMap(
          (user) => user.SecondCollect
        );

        const averageFirstCollect = calculateAverage(allFirstCollectData);
        const averageSecondCollect = calculateAverage(allSecondCollectData);
        const averageCollect = (averageFirstCollect + averageSecondCollect) / 2;

        setAverageFirstCollect(averageFirstCollect);
        setAverageSecondCollect(averageSecondCollect);
        setAverageCollect(averageCollect);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsersData();
  }, [selectedLocation, selectedYear]);

  const calculateAverage = (data) => {
    if (!data || data.length === 0) {
      return 0;
    }

    const sum = data.reduce((acc, num) => {
      const parsedNum = parseFloat(num);
      return isNaN(parsedNum) ? acc : acc + parsedNum;
    }, 0);

    return sum / data.length;
  };

  const renderRow = (label, value) => {
    return (
      <div className="row">
        <span className="label">{label}</span>
        <span className="value">{value}</span>
      </div>
    );
  };

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption.value);
  };

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption.value);
  };

  const navigateTo = (path) => {
    // You would implement your navigation logic here
    // For a web app, this might be using react-router or window.location
    console.log(`Navigating to ${path}`);
  };

  return (
    <div className="background">
      <div className="container">
        <div className="picker-container">
          <Select
            options={cities}
            onChange={handleLocationChange}
            placeholder="Select a location"
            styles={{
              control: (provided) => ({
                ...provided,
                width: 300,
                margin: 10,
              }),
            }}
          />
        </div>
        <div className="picker-container">
          <Select
            options={years}
            onChange={handleYearChange}
            value={years.find((year) => year.value === selectedYear)}
            placeholder="Select a year"
            styles={{
              control: (provided) => ({
                ...provided,
                width: 300,
                margin: 10,
              }),
            }}
          />
        </div>
        <div className="table-container">
          <h2 className="table-title">Statistics</h2>
          {renderRow(
            "Average First Collect:",
            averageFirstCollect.toFixed(2) + "%"
          )}
          {renderRow(
            "Average Second Collect:",
            averageSecondCollect.toFixed(2) + "%"
          )}
          {renderRow("Average Collect:", averageCollect.toFixed(2) + "%")}
        </div>
        <div className="chart-container">
          <VictoryChart domainPadding={30} theme={VictoryTheme.material}>
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => `${tick}%`}
              style={{
                tickLabels: { fontSize: 10, padding: 5 },
              }}
              domain={[0, 100]}
            />
            <VictoryBar
              data={[
                {
                  label: "First Collect",
                  value: averageFirstCollect,
                },
                {
                  label: "Second Collect",
                  value: averageSecondCollect,
                },
                {
                  label: "Average",
                  value: averageCollect,
                },
              ]}
              x="label"
              y="value"
              style={{
                data: {
                  fill: ({ datum }) => {
                    if (datum.label === "First Collect") return "#FF5733";
                    if (datum.label === "Second Collect") return "#33FF55";
                    if (datum.label === "Average") return "#3366FF";
                    return "gray";
                  },
                },
                labels: {
                  fontSize: 12,
                  padding: 5,
                },
              }}
              labels={({ datum }) => `${datum.value.toFixed(2)}%`}
              labelComponent={<VictoryLabel dy={-10} />}
            />
          </VictoryChart>
        </div>
      </div>
      <div className="footer">
        <button
          className="footer-button"
          onClick={() => navigateTo("/colony-search")}
        >
          <img
            src="/assets/search-icon.png"
            className="footer-icon"
            alt="Search"
          />
          <span>ColonySearch</span>
        </button>
        <button
          className="footer-button"
          onClick={() => navigateTo("/messages")}
        >
          <img
            src="/assets/sendMassege.png"
            className="footer-icon"
            alt="Messages"
          />
          <span>Messages</span>
        </button>
        <button
          className="footer-button"
          onClick={() => navigateTo("/add-participant")}
        >
          <img
            src="/assets/addicon.png"
            className="footer-icon"
            alt="Add User"
          />
          <span>AddUser</span>
        </button>
        <button
          className="footer-button"
          onClick={() => navigateTo("/statistics")}
        >
          <img
            src="/assets/stat.png"
            className="footer-icon"
            alt="Statistics"
          />
          <span>Stats</span>
        </button>
        <button
          className="footer-button"
          onClick={() => navigateTo("/")}
        >
          <img
            src="/assets/home.png"
            className="footer-icon"
            alt="Home"
          />
          <span>Home</span>
        </button>
      </div>
    </div>
  );
}