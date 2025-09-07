import { useState, useEffect } from "react";
import { Home, Compass, Users, Bookmark, Plus, MessageSquare } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import usePostStore from "../features/posts/store/usePostStore";
import CreatePostModal from "../features/posts/components/CreatePostModal";

const SideMenu = ({ onCreatePost }) => {
  const [active, setActive] = useState("Home");
  const { authUser } = useAuthStore();

  const menuItems = [
    { name: "For You", icon: <Home /> },
    { name: "Following", icon: <Users /> },
    { name: "Trending", icon: <Compass /> },
    { name: "Saved", icon: <Bookmark /> },
  ];

  return (
    <div className="w-64 bg-base-200 p-5 border-r border-base-300 flex flex-col">
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-2">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center">
              <img 
                src={authUser?.profilePic || "/avatar.png"} 
                alt="avatar"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="font-medium">{authUser?.fullName}</p>
            <p className="text-sm text-base-content/60">@{authUser?.email.split("@")[0]}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {menuItems.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                hover:bg-base-300
                ${active === name ? "bg-primary text-primary-content" : ""}
              `}
            >
              {icon}
              <span>{name}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={onCreatePost}
          className="btn btn-primary w-full gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>
    </div>
  );
};

const TopStream = () => {
  const streamers = [
    { name: "John Doe", handle: "@johndoe", viewers: "20k", game: "League of Legends" },
    { name: "Jane Smith", handle: "@janesmith", viewers: "15k", game: "Valorant" },
    { name: "Alex Johnson", handle: "@alexj", viewers: "10k", game: "CS2" },
    { name: "Sarah Wilson", handle: "@sarah", viewers: "8k", game: "Fortnite" },
    { name: "Mike Brown", handle: "@mike", viewers: "5k", game: "Dota 2" },
  ];

  return (
    <div className="w-96 bg-base-200 p-5 border-l border-base-300">
      <h2 className="text-xl font-bold mb-6">Top Live Streams</h2>
      <div className="space-y-4">
        {streamers.map((streamer) => (
          <div key={streamer.handle} className="bg-base-300 p-4 rounded-lg hover:bg-base-300/80 transition-colors">
            <p className="font-bold">{streamer.name}</p>
            <p className="text-sm text-primary">{streamer.handle}</p>
            <p className="text-sm text-base-content/60 mt-1">{streamer.game}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-base-content/60 flex items-center gap-1">
                <FaEye /> {streamer.viewers}
              </p>
              <button className="btn btn-primary btn-sm">Follow</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomeFeed = () => {
  const { posts, loading, error, fetchPosts, hasMore } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      fetchPosts();
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex-1 p-10 bg-base-100">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-10 bg-base-100">
        <div className="max-w-2xl mx-auto">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-10 bg-base-100">
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base-content/60 text-lg">No posts yet. Be the first to create one!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="bg-base-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img 
                        src={post.author?.profilePic || "/avatar.png"} 
                        alt={post.author?.fullName} 
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{post.author?.fullName}</p>
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                      <span>{formatTimeAgo(post.createdAt)}</span>
                      {post.game && (
                        <>
                          <span>•</span>
                          <span>{post.game}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Text Post with Background */}
              {post.textBackground && (
                <div 
                  className="w-full h-48 rounded-lg p-4 mb-4 relative overflow-hidden"
                  style={{ background: post.textBackground.color }}
                >
                  <p 
                    className="text-lg font-medium"
                    style={{ color: post.textBackground.textColor }}
                  >
                    {post.content}
                  </p>
                </div>
              )}

              {/* Regular Text Post */}
              {!post.textBackground && (
                <p className="mb-4 text-lg">
                  {post.content}
                </p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-4">
                  <span className="text-primary"> 
                    {post.tags.map(tag => `#${tag}`).join(" ")}
                  </span>
                </div>
              )}
              
              {/* Media Images */}
              {post.images && post.images.length > 0 && (
                <div className="mb-4">
                  <div className="w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <div className="w-full h-full grid gap-1">
                      {post.images.length === 1 && (
                        <img
                          src={post.images[0]}
                          alt="Post content"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {post.images.length === 2 && (
                        <>
                          <img
                            src={post.images[0]}
                            alt="Post content 1"
                            className="w-full h-full object-cover"
                          />
                          <img
                            src={post.images[1]}
                            alt="Post content 2"
                            className="w-full h-full object-cover"
                          />
                        </>
                      )}
                      {post.images.length === 3 && (
                        <>
                          <img
                            src={post.images[0]}
                            alt="Post content 1"
                            className="w-full h-full object-cover"
                          />
                          <div className="grid grid-cols-2 gap-1">
                            <img
                              src={post.images[1]}
                              alt="Post content 2"
                              className="w-full h-full object-cover"
                            />
                            <img
                              src={post.images[2]}
                              alt="Post content 3"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </>
                      )}
                      {post.images.length >= 4 && (
                        <>
                          <div className="grid grid-cols-2 gap-1">
                            <img
                              src={post.images[0]}
                              alt="Post content 1"
                              className="w-full h-full object-cover"
                            />
                            <img
                              src={post.images[1]}
                              alt="Post content 2"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <img
                              src={post.images[2]}
                              alt="Post content 3"
                              className="w-full h-full object-cover"
                            />
                            <div className="relative">
                              <img
                                src={post.images[3]}
                                alt="Post content 4"
                                className="w-full h-full object-cover"
                              />
                              {post.images.length > 4 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                  <span className="text-white text-2xl font-bold">
                                    +{post.images.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Single Image (legacy support) */}
              {post.image && !post.images && (
                <img 
                  src={post.image}
                  alt="Post content" 
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <div className="flex gap-4 mt-4">
                <button className="btn btn-ghost btn-sm">❤️ {post.likeCount || 0}</button>
                <button className="btn btn-ghost btn-sm">💬 Comment</button>
                <button className="btn btn-ghost btn-sm">↗️ Share</button>
              </div>
            </div>
          ))
        )}

        {/* Load More Button */}
        {hasMore && posts.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={loadMorePosts}
              disabled={loading}
              className="btn btn-outline"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Loading...
                </>
              ) : (
                "Load More Posts"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const handleCreatePost = () => {
    setIsCreatePostModalOpen(true);
  };

  const handleCloseCreatePost = () => {
    setIsCreatePostModalOpen(false);
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] mt-16">
        <SideMenu onCreatePost={handleCreatePost} />
        <HomeFeed />
        <TopStream />
      </div>
      <CreatePostModal 
        isOpen={isCreatePostModalOpen} 
        onClose={handleCloseCreatePost} 
      />
    </>
  );
};

export default HomePage;