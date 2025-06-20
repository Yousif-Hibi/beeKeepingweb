import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./styles.css";

export default function ColAccInfo() {
  const { uid } = useParams(); // Get UID from URL
  const [user, setUser] = useState(null);
  const [submitVisible, setSubmitVisible] = useState(false);
  const [createPressed, setCreatePressed] = useState(false);
  const [count, setCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) return;

      const userDocRef = doc(db, "keepers", uid);

      try {
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setUser(userDocSnapshot.data());
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (count > 0) setCount(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user || !uid) {
      console.log("User not found");
      return;
    }

    try {
      const docRef = doc(db, "keepers", uid);
      const FirstcollectArr = Array(count).fill("0");
      const SecondcollectArr = Array(count).fill("0");

      await updateDoc(docRef, {
        hiveIDs: arrayUnion(...tableData.map(row => row.hiveID)),
        year: {
          2022: { Firstcollect: [...FirstcollectArr], Secondcollect: [...SecondcollectArr] },
          2023: { Firstcollect: [...FirstcollectArr], Secondcollect: [...SecondcollectArr] },
          2024: { Firstcollect: [...FirstcollectArr], Secondcollect: [...SecondcollectArr] },
          2025: { Firstcollect: [...FirstcollectArr], Secondcollect: [...SecondcollectArr] },
          2026: { Firstcollect: [...FirstcollectArr], Secondcollect: [...SecondcollectArr] },
          2027: { Firstcollect: [...FirstcollectArr], Secondcollect: [...SecondcollectArr] },
          2028: { Firstcollect: [...FirstcollectArr], Secondcollect: [...SecondcollectArr] },
          2029: { Firstcollect: [...FirstcollectArr], Secondcollect: [...SecondcollectArr] },
          2030: { Firstcollect: [...FirstcollectArr], Secondcollect: [...SecondcollectArr] },
        },
      });

      console.log("Bee hive data added to Firestore");
      navigate(`/admin-info`);
    } catch (error) {
      console.error("Error saving hive data:", error);
    }
  };

  const handleCreate = () => {
    const yearsArray = Array.from({ length: 9 }, (_, i) => 2022 + i);
    const yearData = {};
    
    yearsArray.forEach(year => {
      yearData[year] = {
        Firstcollect: Array(count).fill("0"),
        Secondcollect: Array(count).fill("0")
      };
    });

    const newData = Array(count).fill().map((_, i) => ({
      hiveNum: i.toString(),
      hiveID: "",
      year: { ...yearData }
    }));

    setTableData(newData);
    setSubmitVisible(true);
    setCreatePressed(true);
  };

  const handleRowInputChange = (index, field, value) => {
    if (field === "hiveNum" && tableData[index].hiveNum !== "") return;
    
    setTableData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  };

  return (
    <div className="background">
      <div className="container">
        <div className="header">
          <h1 className="title">Choose how many Bee hives!</h1>
        </div>
        
        <div className="button-container">
          {!createPressed && (
            <>
              <button className="button" onClick={handleDecrement}>-</button>
              <span className="count">{count}</span>
              <button className="button" onClick={handleIncrement}>+</button>
            </>
          )}
        </div>

        <div className="table">
          {count > 0 && (
            <>
              <div className="row header-row">
                <div className="column">
                  <span className="column-text">Bee hive num</span>
                </div>
                <div className="column">
                  <span className="column-text">Bee hive ID</span>
                </div>
              </div>
              
              {tableData.map((row, index) => (
                <div className="row" key={index}>
                  <div className="column">
                    <input
                      type="text"
                      className="input"
                      placeholder={index.toString()}
                      value={row.hiveNum}
                      onChange={(e) => handleRowInputChange(index, "hiveNum", e.target.value)}
                      readOnly={row.hiveNum !== ""}
                    />
                  </div>
                  <div className="column">
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter hive ID"
                      value={row.hiveID}
                      onChange={(e) => handleRowInputChange(index, "hiveID", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {!createPressed && (
          <button className="submit-button" onClick={handleCreate}>
            Create
          </button>
        )}
        
        {submitVisible && (
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}