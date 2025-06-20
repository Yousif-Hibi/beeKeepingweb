import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import "./styles.css";

export default function UserInfoScreen() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [isSignatureChecked, setIsSignatureChecked] = useState(false);
  const [isObtainChecked, setIsObtainChecked] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2023");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "keepers", uid);

      try {
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUser(userData);
          setIsSignatureChecked(userData?.signature || false);
          setIsObtainChecked(userData?.obtain || false);

          const currentUser = auth.currentUser;
          if (
            currentUser &&
            Array.isArray(userData.admins) &&
            userData.admins.includes(currentUser.uid)
          ) {
            setIsUserAdmin(true);
          }
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
    checkIfUserIsAdmin();
  }, [uid]);

  const checkIfUserIsAdmin = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const adminRef = doc(db, "admins", currentUser.uid);
      try {
        const adminDocSnapshot = await getDoc(adminRef);
        setShowEditButton(adminDocSnapshot.exists());
      } catch (error) {
        console.error("Error checking admin:", error);
      }
    }
  };

  const handleEditProfile = () => {
    navigate(`/edit-user/${uid}`);
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const userDocRef = doc(db, "keepers", uid);

      try {
        await deleteDoc(userDocRef);
        console.log("User deleted successfully");
        navigate('/admin-info');
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
      }
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="background">
      <div className="container">
        <div className="user-header">
          <div className="user-image-container">
            <img
              src={new URL("../../assets/user.png", import.meta.url).href}
              alt="User"
              className="user-image"
            />
            {user && <h2 className="user-name">{user.name}</h2>}
          </div>

          <div className="user-info">
            {user && <p className="user-info-item">{user.location}</p>}
            {user && <p className="user-info-item">{user.phoneNumber}</p>}
            {user && <p className="user-info-item">{user.idNumber}</p>}
          </div>
        </div>

        <div className="info-row">
          <label>الرسوم:</label>
          {user && <span>{user.payment}</span>}
        </div>

        <div className="info-row">
          <label>مكان تربية النحل:</label>
          {user && <span>{user.hiveLocation}</span>}
        </div>

        <div className="info-row checkbox-row">
          <label>توقيع الوثيقة</label>
          <input
            type="checkbox"
            checked={isSignatureChecked}
            disabled={!user || !user.signature}
            onChange={() => setIsSignatureChecked(!isSignatureChecked)}
          />
        </div>

        <div className="info-row checkbox-row">
          <label>وصل استلام</label>
          <input
            type="checkbox"
            checked={isObtainChecked}
            disabled={!user || !user.obtain}
            onChange={() => setIsObtainChecked(!isObtainChecked)}
          />
        </div>

        <div className="year-selector">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="year-select"
          >
            {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>

        <div className="hive-table">
          <div className="table-header">
            <div className="header-cell">رقم</div>
            <div className="header-cell">رقم المنحلة</div>
            <div className="header-cell">قطف اول</div>
            <div className="header-cell">قطف ثاني</div>
          </div>

          {user?.hiveIDs?.length > 0 ? (
            user.hiveIDs.map((hiveID, i) => (
              <div className="table-row" key={i}>
                <div className="table-cell">{i + 1}</div>
                <div className="table-cell">{hiveID}</div>
                <div className="table-cell">
                  {user.year[selectedYear]?.Firstcollect?.[i] || 0}
                </div>
                <div className="table-cell">
                  {user.year[selectedYear]?.Secondcollect?.[i] || 0}
                </div>
              </div>
            ))
          ) : (
            <div className="no-hives">No hive IDs available.</div>
          )}
        </div>

        <button
          className="messages-button"
          onClick={() => navigate(`/chat/${uid}`)}
        >
          الرسائل
        </button>

        {showEditButton && (
          <div className="action-buttons">
            <button className="edit-button" onClick={handleEditProfile}>
              Edit
            </button>
            <button className="delete-button" onClick={handleDeleteUser}>
              Delete
            </button>
          </div>
        )}
      </div>
      
      {showEditButton && <Footer />}
    </div>
  );
}

function Footer() {
  const navigate = useNavigate();
  

}