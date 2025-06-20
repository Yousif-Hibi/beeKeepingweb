import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db ,auth} from '../../config/firebase';
import './styles.css';

export default function AddParticipant() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName) newErrors.fullName = "Full name is required";
    else if (/\d/.test(fullName)) newErrors.fullName = "Full name cannot contain numbers";
    
    if (!idNumber) newErrors.idNumber = "ID number is required";
    else if (!/^\d{9}$/.test(idNumber)) newErrors.idNumber = "ID must be 9 digits";
    
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d+$/.test(phoneNumber)) newErrors.phoneNumber = "Phone should contain only numbers";
    
    if (!city) newErrors.city = "Location is required";
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    
    if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords don't match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        `${username}@example.com`,
        password
      );

      await setDoc(doc(db, "keepers", user.uid), {
        name: fullName,
        idNumber: idNumber,
        phoneNumber: phoneNumber,
        location: city,
        signature: false,
        obtain: false,
      });

      navigate(`/col-acc-info/${user.uid}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h1 className="title">Add Participant</h1>
        
        <div className="input-group">
          <label>Full Name</label>
          <input
            className={errors.fullName ? 'error-input' : ''}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="input-group">
          <label>ID Number</label>
          <input
            className={errors.idNumber ? 'error-input' : ''}
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
          {errors.idNumber && <span className="error-text">{errors.idNumber}</span>}
        </div>

        <div className="input-group">
          <label>Phone Number</label>
          <input
            className={errors.phoneNumber ? 'error-input' : ''}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
        </div>

        <div className="input-group">
          <label>City</label>
          <select
            className={errors.city ? 'error-input' : ''}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <span className="error-text">{errors.city}</span>}
        </div>

        <div className="input-group">
          <label>Username</label>
          <input
            className={errors.username ? 'error-input' : ''}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            className={errors.password ? 'error-input' : ''}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            className={errors.confirmPassword ? 'error-input' : ''}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        <button className="submit-button" onClick={handleCreateAccount}>
          Create Account
        </button>
      </div>
    </div>
  );
}