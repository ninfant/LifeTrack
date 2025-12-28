import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-8xl mx-auto px-10 py-10 mb-8 ml-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-600">
            LifeTrack
          </Link>

          <div className="flex gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded ${
                isActive("/")
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Home
            </Link>
            <Link
              to="/habits"
              className={`px-4 py-2 rounded ${
                isActive("/habits")
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Hábitos
            </Link>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded ${
                isActive("/dashboard")
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`px-4 py-2 rounded ${
                isActive("/profile")
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Perfil
            </Link>
          </div>
        </div>
      </nav>
      <div className="h-20 bg-gradient-to-br from-green-50"></div>
    </header>
  );
};

export default Header;
