import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  doc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import "./styles.css";

const ADMIN_UID = "urH6ui5XIMZb7gTkeVbQu2saGjh1";

export default function Chat() {
  const { uid } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [userNames, setUserNames] = useState({}); // Store user names here
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const currentUserId = auth.currentUser?.uid;
  const isAdminChat = currentUserId === ADMIN_UID;
  const chatWithId = isAdminChat ? uid : ADMIN_UID;
  const conversationId = [currentUserId, chatWithId].sort().join('_');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to fetch user name
  const fetchUserName = async (userId) => {
    if (userId === ADMIN_UID) return "Admin";
    
    if (userNames[userId]) return userNames[userId];
    
    try {
      const userRef = doc(db, 'keepers', userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userName = userSnapshot.data().name;
        setUserNames(prev => ({ ...prev, [userId]: userName }));
        return userName;
      }
      return "User";
    } catch (err) {
      console.error("Error fetching user name:", err);
      return "User";
    }
  };

  useEffect(() => {
    if (!currentUserId) return;

    const messagesRef = collection(db, 'chats');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      async (snapshot) => {
        try {
          const messagesWithNames = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              const senderName = await fetchUserName(data.senderId);
              return {
                id: doc.id,
                text: data.text,
                senderId: data.senderId,
                senderName: senderName,
                createdAt: data.createdAt?.toDate() || new Date(),
              };
            })
          );

          if (isInitialLoad) {
            setMessages(messagesWithNames);
            setIsInitialLoad(false);
          } else {
            const newMessages = messagesWithNames.filter(
              msg => !messages.some(m => m.id === msg.id)
            );
            if (newMessages.length > 0) {
              setMessages(prev => [...prev, ...newMessages]);
            }
          }
          setError(null);
        } catch (err) {
          console.error("Error loading messages:", err);
          setError("Error loading messages");
        }
      },
      (err) => {
        console.error("Firestore error:", err);
      }
    );

    return () => unsubscribe();
  }, [currentUserId, conversationId, isInitialLoad]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending || !currentUserId) return;

    setIsSending(true);
    try {
      let senderName = await fetchUserName(currentUserId);

      await addDoc(collection(db, 'chats'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        senderId: currentUserId,
        senderName: senderName,
        receiverId: chatWithId,
        participants: [currentUserId, chatWithId],
        conversationId: conversationId
      });

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: newMessage,
        senderId: currentUserId,
        senderName: senderName,
        createdAt: new Date()
      }]);

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      {error && <div className="error-banner">{error}</div>}
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}
            >
              {message.senderId !== currentUserId && (
                <span className="sender-name">{message.senderName}</span>
              )}
              <p>{message.text}</p>
              <span className="message-time">
                {message.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isSending}
          autoFocus
        />
        <button type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
      
      <Footer />
    </div>
  );
}

function Footer() {
  const navigate = useNavigate();
  
  return (
    <div className="footer">
      
    </div>
  );
}