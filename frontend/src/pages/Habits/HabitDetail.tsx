import { useParams } from "react-router-dom";
import { useHabitById, useHabitStreak } from "../../hooks/useHabits";
import HabitCalendar from "../../components/habits/HabitCalendar/HabitCalendar";
import Container from "../../components/layout/Container";

const HabitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: habit, isLoading, isError } = useHabitById(id || "");
  const { data: streak } = useHabitStreak(id || "");

  if (isLoading) {
    return <div className="text-center py-12">Cargando hábito...</div>;
  }
  //El backend retorna un objeto con habitbyid dentro
  if (isError || !habit?.habitbyid) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error al cargar el hábito</p>
      </div>
    );
  }

  return (
    <Container>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{habit.habitbyid.name}</h1>
        <p className="text-gray-600 mb-4">{habit.habitbyid.objective}</p>

        {streak && (
          <div className="flex gap-6 mb-4">
            <div>
              <span className="text-sm text-gray-500">Current Streak</span>
              <p className="text-2xl font-bold text-green-600">
                🔥 {streak.currentStreak} días
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Longest Streak</span>
              <p className="text-2xl font-bold text-blue-600">
                🏆 {streak.longestStreak} días
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Calendario</h2>
        <HabitCalendar habit={habit.habitbyid} />
      </div>
    </Container>
  );
};

export default HabitDetail;
