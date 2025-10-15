import { create } from "zustand";
import { axiosInstance as axios } from "../../../shares/lib/axios";

const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  lastPostId: null,

  // Fetch posts with infinite scroll
  fetchPosts: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const { lastPostId } = get();
      const url = lastPostId 
        ? `/posts?limit=${limit}&lastPostId=${lastPostId}`
        : `/posts?limit=${limit}`;

      const response = await axios.get(url);
      const { posts, hasMore, lastPostId: newLastPostId } = response.data.data;
      
      set({
        posts: [...get().posts, ...posts],
        hasMore,
        lastPostId: newLastPostId,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch posts",
        loading: false
      });
    }
  },

  // Create new post
  createPost: async (postData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/posts', postData);
      const newPost = response.data.data;

      set({
        posts: [newPost, ...get().posts],
        loading: false
      });

      return { success: true, data: newPost };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create post",
        loading: false
      });
      return { success: false, error: error.response?.data?.message || "Failed to create post" };
    }
  },

  // Fetch posts of a specific user (Profile page)
  fetchUserPosts: async (userId, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const { lastPostId } = get();
      const url = lastPostId 
        ? `/posts/user/${userId}?limit=${limit}&lastPostId=${lastPostId}`
        : `/posts/user/${userId}?limit=${limit}`;

      const response = await axios.get(url);
      const { posts, hasMore, lastPostId: newLastPostId } = response.data.data;

      set({
        posts: [...get().posts, ...posts],
        hasMore,
        lastPostId: newLastPostId,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch user posts",
        loading: false
      });
    }
  },

  // Clear posts
  clearPosts: () => {
    set({
      posts: [],
      hasMore: true,
      lastPostId: null,
      error: null
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default usePostStore;
