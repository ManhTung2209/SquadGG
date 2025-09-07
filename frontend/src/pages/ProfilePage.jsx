import { useState, useEffect } from "react";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import usePostStore from "../features/posts/store/usePostStore";
import { Camera, Mail, User, Grid, List } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { posts, loading, error, fetchUserPosts } = usePostStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  useEffect(() => {
    if (authUser?._id) {
      fetchUserPosts(authUser._id);
    }
  }, [authUser?._id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Posts</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base-content/60 text-lg">No posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              {posts.map(post => (
                <div key={post._id} className="bg-base-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-base-content/60">
                      {formatTimeAgo(post.createdAt)}
                    </span>
                    {post.game && (
                      <>
                        <span>•</span>
                        <span className="text-sm text-primary">{post.game}</span>
                      </>
                    )}
                  </div>

                  {/* Text Post with Background */}
                  {post.textBackground && (
                    <div 
                      className="w-full h-32 rounded-lg p-3 mb-3 relative overflow-hidden"
                      style={{ background: post.textBackground.color }}
                    >
                      <p 
                        className="text-sm font-medium"
                        style={{ color: post.textBackground.textColor }}
                      >
                        {post.content}
                      </p>
                    </div>
                  )}

                  {/* Regular Text Post */}
                  {!post.textBackground && (
                    <p className="mb-3 text-sm">{post.content}</p>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs text-primary"> 
                        {post.tags.map(tag => `#${tag}`).join(" ")}
                      </span>
                    </div>
                  )}

                  {/* Media Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
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
                          {post.images.length >= 3 && (
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
                                {post.images.length > 3 && (
                                  <div className="relative">
                                    <img
                                      src={post.images[3]}
                                      alt="Post content 4"
                                      className="w-full h-full object-cover"
                                    />
                                    {post.images.length > 4 && (
                                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">
                                          +{post.images.length - 4}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
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
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}

                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-xs">❤️ {post.likeCount || 0}</button>
                    <button className="btn btn-ghost btn-xs">💬 Comment</button>
                    <button className="btn btn-ghost btn-xs">↗️ Share</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
