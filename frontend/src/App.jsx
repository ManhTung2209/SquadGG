import Navbar from "./shares/components/Navbar";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./features/auth/store/useAuthStore";
import { useThemeStore } from "./shares/store/useThemeStore";
import { useChatStore } from "./features/chat/store/useChatStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers, socket } = useAuthStore();
  const { theme } = useThemeStore();
  const { selectedUser } = useChatStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for new messages at app level
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const { messages, selectedUser, unreadMessages } = useChatStore.getState();
      
      // If message is from currently selected user, add to messages
      if (selectedUser?._id === newMessage.senderId) {
        useChatStore.setState({
          messages: [...messages, newMessage],
        });
      } else {
        // Otherwise increment unread count
        const updatedUnreadMessages = { ...unreadMessages };
        updatedUnreadMessages[newMessage.senderId] = (updatedUnreadMessages[newMessage.senderId] || 0) + 1;
        useChatStore.setState({ unreadMessages: updatedUnreadMessages });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
