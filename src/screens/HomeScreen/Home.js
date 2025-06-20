import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import './styles.css';

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { user } = await signInWithEmailAndPassword(
        auth,
        `${username}@example.com`,
        password
      );

      setIsLoading(false);

      if (user) {
        const uid = user.uid;
        console.log(uid);

        if (uid === "vSASeJ65mCgLlwCOGSRDnt6Mpuv1"|| uid=== "urH6ui5XIMZb7gTkeVbQu2saGjh1") {
          navigate('/admin-info');
        } else {
          navigate(`/user-info/${uid}`);
        }
      } else {
        alert('Error: User not found or login failed!');
      }
    } catch (error) {
      setIsLoading(false);
      alert('Error: User not found or login failed!');
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h1 className="title">Welcome to Bees App!</h1>
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isLoading ? (
          <div className="loader">Loading...</div>
        ) : (
          <button className="button" onClick={handleLogin}>
            Log In
          </button>
        )}
      </div>
    </div>
  );
}