import { useState } from "react";
import type { FormEvent } from "react";
import {
  useGetHabitsQuery,
  useCreateHabitMutation,
  useDeleteHabitMutation,
  useUpdateHabitMutation,
} from "../../store/features/habits/habitsApi";

interface HabitsListProps {
  userId: string;
}

const HabitsList = ({ userId }: HabitsListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Query: Obtener hábitos (automático)
  const { data, isLoading, isError, error, refetch } =
    useGetHabitsQuery(userId);

  // Mutations: Crear, actualizar, eliminar
  const [createHabit, { isLoading: isCreating }] = useCreateHabitMutation();
  const [deleteHabit, { isLoading: isDeleting }] = useDeleteHabitMutation();
  const [updateHabit, { isLoading: isUpdating }] = useUpdateHabitMutation();

  // Handler para crear hábito
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createHabit({
        ...formData,
        userId,
      }).unwrap();

      // Limpiar formulario y cerrar
      setFormData({ name: "", description: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error creando hábito:", err);
      alert("Error al crear el hábito");
    }
  };

  // Handler para eliminar
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este hábito?")) {
      try {
        await deleteHabit(id).unwrap();
      } catch (err) {
        console.error("Error eliminando hábito:", err);
        alert("Error al eliminar el hábito");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando hábitos...</div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">
          Error: {(error as any)?.data?.message || "Error al cargar hábitos"}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Hábitos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showForm ? "Cancelar" : "+ Nuevo Hábito"}
        </button>
      </div>

      {/* Formulario para crear */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-4 bg-gray-100 rounded-lg"
        >
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Nombre</label>
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
            <label className="block mb-2 font-semibold">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isCreating ? "Creando..." : "Crear Hábito"}
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
              <p className="text-gray-600 mb-4">{habit.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(habit._id)}
                  disabled={isDeleting}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  Eliminar
                </button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                  Ver Detalle
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            No tienes hábitos aún. ¡Crea uno!
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsList;
