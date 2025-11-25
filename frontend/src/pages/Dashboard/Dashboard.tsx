import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useGetHabitsQuery } from "../../store/features/habits/habitsApi";

const Dashboard = () => {
  const userId = useSelector((state: RootState) => (state as any).user?.id);
  const { data, isLoading } = useGetHabitsQuery(userId || "");

  if (isLoading) {
    return <div className="text-center">Cargando...</div>;
  }

  const habits = data?.allhabits || [];
  const totalHabits = habits.length;
  const completedToday = habits.filter((habit: any) => {
    const today = new Date().toDateString();
    return habit.completions?.some(
      (c: any) => new Date(c.date).toDateString() === today && c.completed
    );
  }).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Total de Hábitos
          </h3>
          <p className="text-3xl font-bold text-green-600">{totalHabits}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Completados Hoy
          </h3>
          <p className="text-3xl font-bold text-blue-600">{completedToday}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Pendientes
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {totalHabits - completedToday}
          </p>
        </div>
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
