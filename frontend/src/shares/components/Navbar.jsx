import { Link } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { LogOut, Settings, User, MessageSquare } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-200 border-b border-base-300 fixed w-full top-0 z-40">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center p-2">
                <Logo className="w-full h-full text-primary" />
              </div>
              <h1 className="text-lg font-bold">SquadGG</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {authUser && (
              <Link
                to="/chat"
                className="btn btn-sm btn-ghost gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </Link>
            )}
            
            <Link
              to={"/settings"}
              className="btn btn-sm btn-ghost gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img 
                      src={authUser?.profilePic || "/avatar.png"} 
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
                  <li className="menu-title font-medium px-2 pt-2">
                    <span>{authUser?.fullName}</span>
                    <span className="text-xs text-base-content/60 font-normal">
                      @{authUser?.email.split("@")[0]}
                    </span>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link to="/profile" className="py-3">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={logout} className="py-3 text-error">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
