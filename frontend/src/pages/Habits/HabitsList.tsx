import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  useHabits,
  useCreateHabit,
  useDeleteHabit,
} from "../../hooks/useHabits";

interface HabitsListProps {
  userId: string;
}

const HabitsList = ({ userId }: HabitsListProps) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    objective: "",
  });
  const { data, isLoading, isError, error, refetch } = useHabits(userId);
  const { mutateAsync: createHabit, isPending: isCreating } = useCreateHabit();
  const { mutateAsync: deleteHabit, isPending: isDeleting } = useDeleteHabit();

  // Handler para crear hábito
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createHabit({
        ...formData,
        userId,
      });

      // Limpiar formulario y cerrar
      setFormData({ name: "", category: "", objective: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error creating habit:", err);
      alert("Error creating habit");
    }
  };

  // Handler para eliminar
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await deleteHabit(id);
      } catch (err) {
        console.error("Error deleting habit:", err);
        alert("Error deleting habit");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading habits...</div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">
          Error: {(error as any)?.data?.message || "Error loading habits"}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Habits</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showForm ? "Cancel" : "+ New Habit"}
        </button>
      </div>

      {/* Formulario para crear */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-4 bg-gray-100 rounded-lg"
        >
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              placeholder="Ej: Health, Productivity, Exercise..."
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Objective</label>
            <textarea
              value={formData.objective}
              onChange={(e) =>
                setFormData({ ...formData, objective: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              placeholder="Describe your objective with this habit..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create Habit"}
          </button>
        </form>
      )}

      {/* Lista de hábitos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.allhabits?.length > 0 ? (
          data.allhabits.map((habit: any) => (
            <div
              key={habit._id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{habit.name}</h3>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-semibold">Category:</span>{" "}
                {habit.category}
              </p>
              <p className="text-gray-600 mb-4">{habit.objective}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(habit._id)}
                  disabled={isDeleting}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/habits/${habit._id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            You don't have any habits yet. Create one!
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsList;
