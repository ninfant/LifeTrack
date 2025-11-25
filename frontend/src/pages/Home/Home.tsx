import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Bienvenido a LifeTrack
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Rastrea tus hábitos y alcanza tus metas diarias
      </p>

      <div className="flex gap-4 justify-center">
        <Link
          to="/habits"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Ver Mis Hábitos
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;
