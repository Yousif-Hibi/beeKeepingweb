import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import './styles.css';

export default function CheckMessages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const ADMIN_UID = "urH6ui5XIMZb7gTkeVbQu2saGjh1";

  // Function to get user name from keepers collection
  const getUserName = async (userId) => {
    if (!userId) return "Unknown";
    try {
      const userDoc = await getDoc(doc(db, 'keepers', userId));
      return userDoc.exists() ? userDoc.data().name : "Unknown";
    } catch (err) {
      console.error("Error fetching user name:", err);
      return "Unknown";
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const chatsRef = collection(db, 'chats');
        const q = query(
          chatsRef,
          where('participants', 'array-contains', ADMIN_UID)
        );
        
        const querySnapshot = await getDocs(q);
        const conversationsMap = new Map();

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const conversationId = data.conversationId;
          const otherParticipantId = data.participants.find(uid => uid !== ADMIN_UID);
          
          // Skip if we already have a newer message for this conversation
          const existing = conversationsMap.get(conversationId);
          if (existing && data.createdAt?.toDate() <= existing.createdAt) {
            continue;
          }

          // Get the other user's name
          const otherUserName = await getUserName(otherParticipantId);

          conversationsMap.set(conversationId, {
            id: conversationId,
            otherParticipantId,
            otherUserName,
            lastMessage: data.text,
            createdAt: data.createdAt?.toDate() || new Date()
          });
        }

        // Convert to array and sort by timestamp
        const conversationsData = Array.from(conversationsMap.values())
          .sort((a, b) => b.createdAt - a.createdAt);

        setConversations(conversationsData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleChatPress = (otherParticipantId) => {
    navigate(`/chat/${otherParticipantId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Admin Messages</h1>
      <div className="messages-list">
        {conversations.map((conv) => (
          <div 
            key={conv.id} 
            className="message-item" 
            onClick={() => handleChatPress(conv.otherParticipantId)}
          >
            <div className="message-header">
              <span className="message-name">{conv.otherUserName}</span>
              <span className="message-time">
                {conv.createdAt.toLocaleString()}
              </span>
            </div>
            <div className="message-preview">{conv.lastMessage}</div>
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
      <button className="footer-button" onClick={() => navigate('/colony-search')}>
        <span>ColonySearch</span>
      </button>
      <button className="footer-button" onClick={() => navigate('/add-participant')}>
        <span>AddUser</span>
      </button>
      <button className="footer-button" onClick={() => navigate('/statistics')}>
        <span>Stats</span>
      </button>
      <button className="footer-button" onClick={() => navigate('/admin-info')}>
        <span>Home</span>
      </button>
    </div>
  );
}