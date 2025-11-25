import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import HabitsList from "./pages/Habits/HabitsList";
import HabitDetail from "./pages/Habits/HabitDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import { useGetUserByIdQuery } from "./store/features/user/userApi.ts";

function App() {
  // Obtener userId de localStorage (o hardcodeado para pruebas)
  const userId = localStorage.getItem("userId") || "6911080679130dcd6c8c0d2b"; // Reemplaza con un userId real

  const { data, isLoading } = useGetUserByIdQuery(userId);
  const user = data?.user;
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
          <Route path="/profile" element={<Profile user={user} />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
