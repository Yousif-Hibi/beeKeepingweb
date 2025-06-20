import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import './styles.css';

export default function ChatScreen() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const adminId = auth.currentUser?.uid;

  useEffect(() => {
    if (!adminId || !userId) return;

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', adminId),
      where('participants', 'array-contains', userId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [adminId, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'chats'), {
        text: newMessage,
        senderId: adminId,
        participants: [adminId, userId],
        createdAt: serverTimestamp(),
        name: auth.currentUser?.displayName || 'Admin'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with User</h2>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.senderId === adminId ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">
                {message.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="chat-input-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={3}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}