import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../shares/lib/axios";
import { useAuthStore } from "../../auth/store/useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadMessages: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      
      // Initialize unread messages count for each user
      const unreadCounts = {};
      for (const user of res.data) {
        const unreadRes = await axiosInstance.get(`/messages/unread/${user._id}`);
        if (unreadRes.data.count > 0) {
          unreadCounts[user._id] = unreadRes.data.count;
        }
      }
      
      set({ 
        users: res.data,
        unreadMessages: unreadCounts,
        selectedUser: null // Reset selected user when getting users list
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      // Clear unread messages when opening chat
      const unreadMessages = { ...get().unreadMessages };
      delete unreadMessages[userId];
      set({ unreadMessages });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      
      if (isMessageSentFromSelectedUser) {
        set({
          messages: [...get().messages, newMessage],
        });
      } else {
        // Increment unread count for sender
        const unreadMessages = { ...get().unreadMessages };
        unreadMessages[newMessage.senderId] = (unreadMessages[newMessage.senderId] || 0) + 1;
        set({ unreadMessages });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    if (selectedUser) {
      // Clear unread messages when selecting user
      const unreadMessages = { ...get().unreadMessages };
      delete unreadMessages[selectedUser._id];
      set({ unreadMessages });
      // Get messages when selecting user
      get().getMessages(selectedUser._id);
    }
  },

  // Reset chat state when logging out
  resetState: () => {
    set({
      messages: [],
      users: [],
      selectedUser: null,
      unreadMessages: {}
    });
  }
}));
