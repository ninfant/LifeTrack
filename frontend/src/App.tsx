import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import HabitsList from "./pages/Habits/HabitsList";
import HabitDetail from "./pages/Habits/HabitDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import { useUserById } from "./hooks/useUsers";
import { setUser } from "./store/features/user/userSlice";
import "./index.css";

function App() {
  const dispatch = useDispatch();
  // Obtener userId de localStorage (o hardcodeado para pruebas)
  const userId = localStorage.getItem("userId") || "6911080679130dcd6c8c0d2b"; // Reemplaza con un userId real

  const { data, isLoading } = useUserById(userId);
  const user = data?.user;

  // The backend returns the Mongo document, which carries _id instead of id.
  // Normalize it here when storing it in Redux so the rest of the app
  // (Dashboard, Profile) always reads the same shape from a single source.
  useEffect(() => {
    if (user) {
      dispatch(setUser({ id: user._id, name: user.name, email: user.email }));
    }
  }, [user, dispatch]);

  if (isLoading) {
    return <div className="text-center">Cargando...</div>;
  }
  if (!user) {
    return <div className="text-center">Usuario no encontrado</div>;
  }
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/habits"
            element={<HabitsList userId={userId || ""} />}
          />
          <Route path="/habits/:id" element={<HabitDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
