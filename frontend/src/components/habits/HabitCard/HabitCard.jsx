import { useGetHabitStreakQuery } from "../../../store/features/habits/habitsApi.ts";

const HabitCard = ({ habit }) => {
  // Query para obtener el streak del hábito
  const { data: streakData, isLoading: isLoadingStreak } =
    useGetHabitStreakQuery(habit._id);

  return (
    <div className="p-4 border rounded-lg shadow hover:shadow-lg transition bg-white">
      <h3 className="text-xl font-semibold mb-2">{habit.name}</h3>
      <p className="text-gray-600 mb-4">{habit.description}</p>

      {/* Mostrar streak si está disponible */}
      {!isLoadingStreak && streakData && (
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-sm text-gray-500">Current Streak</div>
              <div className="text-lg font-bold">
                {streakData.currentStreak} días
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="text-sm text-gray-500">Longest Streak</div>
              <div className="text-lg font-bold">
                {streakData.longestStreak} días
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
          Ver Detalle
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
