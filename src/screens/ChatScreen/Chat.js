import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  const { uid: urlUid } = useParams();
  const navigate = useNavigate();

  // State declarations
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [shouldReload, setShouldReload] = useState(false);

  // Auth state handling
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        navigate('/');
      }
    });
    
    return unsubscribeAuth;
  }, [navigate]);

  // Calculate conversation ID
  const conversationId = useMemo(() => {
    if (!currentUserId || !urlUid) return null;
    
    const isAdminChat = currentUserId === ADMIN_UID;
    const chatWithId = isAdminChat ? urlUid : ADMIN_UID;
    return [currentUserId, chatWithId].sort().join('_');
  }, [currentUserId, urlUid]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch user name
  const fetchUserName = async (userId) => {
    if (userId === ADMIN_UID) return "Admin";
    
    try {
      const userRef = doc(db, 'keepers', userId);
      const userSnapshot = await getDoc(userRef);
      return userSnapshot.exists() ? userSnapshot.data().name : "User";
    } catch {
      return "User";
    }
  };

  // Load messages on every reload
  useEffect(() => {
    if (!conversationId) return;

    setIsLoading(true);
    setMessages([]);

    const messagesRef = collection(db, 'chats');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const messagePromises = snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const senderName = await fetchUserName(data.senderId);
          
          return {
            id: doc.id,
            text: data.text,
            senderId: data.senderId,
            senderName: senderName,
            createdAt: data.createdAt?.toDate() || new Date(),
          };
        });

        const newMessages = await Promise.all(messagePromises);
        setMessages(newMessages);
        
        // Reset reload flag if messages load successfully
        setShouldReload(false);
      } catch (err) {
        console.error("Error loading messages:", err);
        // Set flag to reload if there's an error
        setShouldReload(true);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [conversationId]);

  // Reload page if needed
  useEffect(() => {
    if (shouldReload) {
      console.log("Reloading page to fix loading issues...");
      navigate(0); // Reloads the current page
    }
  }, [shouldReload, navigate]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending || !currentUserId || !conversationId) return;

    setIsSending(true);
    try {
      const isAdminChat = currentUserId === ADMIN_UID;
      const chatWithId = isAdminChat ? urlUid : ADMIN_UID;
      const senderName = await fetchUserName(currentUserId);
      
      await addDoc(collection(db, 'chats'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        senderId: currentUserId,
        senderName: senderName,
        receiverId: chatWithId,
        participants: [currentUserId, chatWithId],
        conversationId: conversationId
      });

      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="chat-container">
        <div className="loading-spinner">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
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
    </div>
  );
}