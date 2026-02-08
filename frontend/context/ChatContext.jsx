import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";

export const ChatContext = React.createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // 🔹 Get all users for sidebar
  const getUsers = async () => {
    
    try {
       
    const { data } = await axios.get("/api/messages/users");
      
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMsg); // ✅ FIXED: was unseenMessages
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load users");
    }
  };

  // 🔹 Get messages of selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load messages");
    }
  };

  // 🔹 Send message
  const sendMessage = async (message) => {
    if (!selectedUser) return;

    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        message
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMsg]); // ✅ Also fixed: was data.newMessage
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    }
  };

  // 🔹 Subscribe to new messages
  const markMessages = () => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return handleNewMessage;
  };

  // 🔹 Unsubscribe from socket
  const unSubscribe = (handler) => {
    if (socket && handler) {
      socket.off("newMessage", handler);
    }
  };

  // 🔹 Effect for socket lifecycle
  useEffect(() => {
    const handler = markMessages();

    return () => {
      unSubscribe(handler);
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    setMessages,
    setSelectedUser,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;