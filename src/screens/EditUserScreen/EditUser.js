import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import './styles.css';

export default function EditUserScreen() {
  const [keeperData, setKeeperData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2023");
  
  const { uid } = useParams();
  const navigate = useNavigate();

  const cities = [
    "Old City / البلدة القديمة",
    "ras al amood / رأس العامود",
    "Beit Hanina / بيت حنينا",
    "Shuafat / شعفاط",
    "Silwan / سلوان",
    "Issawiya / العيسوية",
    "Jabal Mukaber / جبل المكبر",
    "Beit Safafa / بيت صفافا",
    "Abu Tor / ثوري",
    "Al Toor / الطور",
    "Em toba / ام طوبة",
    "Wadi el joz / وادي الجوز",
    "Abu des / أبو ديس",
    "Al Eizareya / العيزرية",
    "Anata / مخيم أناتا",
    "Zeayem / زعيم",
    "Kofor Akab / كفر عقب",
  ];

  useEffect(() => {
    const fetchKeeperData = async () => {
      if (!uid) {
        console.log("Invalid uid");
        return;
      }

      const keeperDocRef = doc(db, "keepers", uid);

      try {
        const keeperDocSnapshot = await getDoc(keeperDocRef);

        if (keeperDocSnapshot.exists()) {
          const keeper = keeperDocSnapshot.data();
          setKeeperData(keeper);
          setEditedData(keeper);

          const newTableData = keeper.hiveIDs.map((hiveID, index) => ({
            hiveIDs: hiveID,
            Secondcollect: keeper.year[selectedYear]?.Secondcollect?.[index],
            Firstcollect: keeper.year[selectedYear]?.Firstcollect?.[index],
          }));

          setTableData(newTableData);
        } else {
          console.log("Keeper not found");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchKeeperData();
  }, [uid, selectedYear]);

  const handleInputChange = (key, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!uid) {
      console.log("Invalid uid");
      return;
    }

    const keeperDocRef = doc(db, "keepers", uid);

    try {
      await updateDoc(keeperDocRef, editedData);
      console.log("Keeper data updated successfully!");
      navigate("/admin-info");
    } catch (error) {
      console.error("Error updating keeper data:", error);
    }
  };

  const handleTableInputChange = (index, key, value) => {
    const updatedTableData = tableData.map((rowData, rowIndex) => {
      if (rowIndex === index) {
        return {
          ...rowData,
          [key]: value,
        };
      }
      return rowData;
    });

    setTableData(updatedTableData);

    const updatedEditedData = { ...editedData };

    if (!updatedEditedData.year) {
      updatedEditedData.year = {};
    }

    if (!updatedEditedData.year[selectedYear]) {
      updatedEditedData.year[selectedYear] = {};
    }

    if (key === "Firstcollect") {
      updatedEditedData.year[selectedYear][key] = updatedTableData.map(
        (rowData) => rowData[key]
      );
    } else if (key === "Secondcollect") {
      updatedEditedData.year[selectedYear][key] = updatedTableData.map(
        (rowData) => rowData[key]
      );
    }

    setEditedData(updatedEditedData);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  if (!keeperData) {
    return <div className="loading-text">Loading...</div>;
  }

  return (
    <div className="background-image">
      <div className="container">
        <div className="label-container">
          <label className="label-text">Name:</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            className="input"
            value={editedData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <div className="line" />
        </div>

        <div className="label-container">
          <label className="label-text">Phone Number:</label>
        </div>
        <input
          type="text"
          className="input"
          value={editedData.phoneNumber || ""}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
        />

        <div className="label-container">
          <label className="label-text">Location:</label>
        </div>
        <select
          value={editedData.location || ""}
          className={`select-input ${cityError ? "error-input" : ""}`}
          onChange={(e) => handleInputChange("location", e.target.value)}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <div className="label-container">
          <label className="label-text">ID:</label>
        </div>
        <input
          type="text"
          className="input"
          value={editedData.idNumber || ""}
          onChange={(e) => handleInputChange("idNumber", e.target.value)}
        />

        <div className="label-container">
          <label className="label-text">Hive Location:</label>
        </div>
        <input
          type="text"
          className="input"
          value={editedData.hiveLocation || ""}
          onChange={(e) => handleInputChange("hiveLocation", e.target.value)}
        />

        <div className="label-container">
          <label className="label-text">Payment:</label>
        </div>
        <input
          type="text"
          className="input"
          value={editedData.payment || ""}
          onChange={(e) => handleInputChange("payment", e.target.value)}
        />

        <div className="toggle-container">
          <label className="label-text">Signature:</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={editedData.signature || false}
              onChange={(e) => handleInputChange("signature", e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="toggle-container">
          <label className="label-text">Obtain:</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={editedData.obtain || false}
              onChange={(e) => handleInputChange("obtain", e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="label-container">
          <label className="label-text">Year:</label>
        </div>
        <div className="picker-container">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="picker"
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
          </select>
        </div>

        <div className="table-container">
          <div className="table-header">
            <div className="table-header-text">Hive ID</div>
            <div className="table-header-text">FirstCollect</div>
            <div className="table-header-text">SecondCollect</div>
          </div>
          {editedData && editedData.hiveIDs ? (
            editedData.hiveIDs.map((hiveIDs, i) => (
              <div className="table-row" key={i}>
                <div className="table-cell">{hiveIDs}</div>
                <input
                  type="text"
                  className="table-cell-input"
                  value={editedData.year?.[selectedYear]?.Firstcollect?.[i] || ""}
                  onChange={(e) =>
                    handleTableInputChange(i, "Firstcollect", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="table-cell-input"
                  value={editedData.year?.[selectedYear]?.Secondcollect?.[i] || ""}
                  onChange={(e) =>
                    handleTableInputChange(i, "Secondcollect", e.target.value)
                  }
                />
              </div>
            ))
          ) : (
            <div>No hive IDs available.</div>
          )}
        </div>

        <button className="save-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
}