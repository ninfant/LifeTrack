import { useLogCompletion } from "../../../hooks/useHabits";
import * as helpers from "../../../helpers/habitHelpers";

const HabitCalendar = ({ habit }: { habit: any }) => {
  const { mutateAsync: logCompletion, isPending: isLoading } =
    useLogCompletion();

  // Handler para marcar día como completado
  const handleToggleDay = async (date: Date) => {
    try {
      const normalizedDate = helpers.normalizeDate(date);
      // Verificar si el día ya está completado
      const isCompleted = habit.completions?.some((c: any) => {
        const completionDate = helpers.normalizeDate(new Date(c.date));
        return (
          completionDate.getTime() === normalizedDate.getTime() && c.completed
        );
      });

      await logCompletion({
        id: habit._id,
        date: helpers.formatDateToYYYYMMDD(date), // Formato YYYY-MM-DD sin problemas de zona horaria
        completed: !isCompleted, // Toggle: si está completado, desmarcar; si no, marcar
      });

      // React Query automáticamente refetch gracias a invalidateQueries
    } catch (err) {
      console.error("Error marcando día:", err);
      alert("Error al marcar el día");
    }
  };

  // Generar días del mes actual
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Calendario</h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const date = new Date(today.getFullYear(), today.getMonth(), day);
          const normalizedDate = helpers.normalizeDate(date);
          const isCompleted = habit.completions?.some((c: any) => {
            const completionDate = helpers.normalizeDate(new Date(c.date));
            return (
              completionDate.getTime() === normalizedDate.getTime() &&
              c.completed
            );
          });

          return (
            <button
              key={day}
              onClick={() => handleToggleDay(date)}
              disabled={isLoading}
              className={`
                p-2 rounded border text-sm
                ${isCompleted ? "bg-green-500 text-white" : "bg-gray-100"}
                hover:bg-green-400 transition
                disabled:opacity-50
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HabitCalendar;
