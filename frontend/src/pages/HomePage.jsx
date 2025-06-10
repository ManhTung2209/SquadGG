import { useState } from "react";
import { Home, Compass, Users, Bookmark, Plus, MessageSquare } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { useAuthStore } from "../features/auth/store/useAuthStore";

const SideMenu = () => {
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

        <button className="btn btn-primary w-full gap-2">
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
  const posts = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/avatar.png",
        handle: "@johndoe"
      },
      content: "Just hit Global Elite in CS2! Thanks to everyone who supported the stream 🎮",
      tags: ["gaming", "csgo", "achievement"],
      image: "/placeholder.jpg",
      timeAgo: "2 hours ago",
      game: "Counter-Strike 2"
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar: "/avatar.png",
        handle: "@janesmith"
      },
      content: "New personal best in Valorant! Diamond rank achieved! 🎯",
      tags: ["valorant", "gaming", "ranked"],
      image: "/placeholder.jpg",
      timeAgo: "5 hours ago",
      game: "Valorant"
    }
  ];

  return (
    <div className="flex-1 p-10 bg-base-100">
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-base-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img src={post.user.avatar} alt={post.user.name} />
                  </div>
                </div>
                <div>
                  <p className="font-medium">{post.user.name}</p>
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <span>{post.timeAgo}</span>
                    <span>•</span>
                    <span>{post.game}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mb-4">
              {post.content}
              <span className="text-primary"> 
                {post.tags.map(tag => `#${tag}`).join(" ")}
              </span>
            </p>
            
            <img 
              src={post.image}
              alt="Post content" 
              className="w-full h-64 object-cover rounded-lg"
            />

            <div className="flex gap-4 mt-4">
              <button className="btn btn-ghost btn-sm">❤️ Like</button>
              <button className="btn btn-ghost btn-sm">💬 Comment</button>
              <button className="btn btn-ghost btn-sm">↗️ Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] mt-16">
      <SideMenu />
      <HomeFeed />
      <TopStream />
    </div>
  );
};

export default HomePage;