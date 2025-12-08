import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useHabits } from "../../hooks/useHabits";

const Dashboard = () => {
  const userId = useSelector((state: RootState) => (state as any).user?.id);
  const { data, isLoading } = useHabits(userId || "");

  const habits = data?.allhabits || [];
  const totalHabits = habits.length;
  // aqui se filtra los hábitos que se han completado hoy
  const completedToday = habits.filter((habit: any) => {
    const today = new Date().toDateString(); //Obtiene la fecha de hoy como string
    return habit.completions?.some(
      (completion: any) =>
        new Date(completion.date).toDateString() === today &&
        completion.completed // con && ambas condiciones deberian ser true para que el some retorne true sino sigue buscando en el array
    );
  }).length; // aqui se obtiene la cantidad de hábitos que se han completado hoy

  const stats = [
    { title: "Total de Hábitos", value: totalHabits, color: "text-green-600" },
    { title: "Completados Hoy", value: completedToday, color: "text-blue-600" },
    {
      title: "Pendientes",
      value: totalHabits - completedToday,
      color: "text-orange-600",
    },
  ];

  if (isLoading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-600 mb-3">
              {stat.title}
            </h3>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No tienes hábitos aún</p>
          <a
            href="/habits"
            className="text-green-500 hover:text-green-600 font-semibold"
          >
            Crear mi primer hábito
          </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
