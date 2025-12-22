import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitsService } from "../services/habitsService";

// GET all habits
export const useHabits = (userId: string) => {
  return useQuery({
    queryKey: ["habits", userId],
    queryFn: () => habitsService.getHabits(userId),
    enabled: !!userId, // Solo ejecutar si userId existe
  });
};

// GET habit by id
export const useHabitById = (id: string) => {
  return useQuery({
    queryKey: ["habit", id],
    queryFn: () => habitsService.getHabitById(id),
    enabled: !!id,
  });
};

// CREATE habit
export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  //retorna un objeto con las propiedades: mutateAsync, isPending, isError, error, isSuccess
  return useMutation({
    mutationFn: habitsService.createHabit,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["habits", variables.userId] });
    },
  });
};

// DELETE habit
export const useDeleteHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: habitsService.deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};

// LOG completion
export const useLogCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      date?: string;
      completed: boolean;
    }) => habitsService.logCompletion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["habit", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};

// GET streak
export const useHabitStreak = (id: string) => {
  return useQuery({
    queryKey: ["habit-streak", id],
    queryFn: () => habitsService.getStreak(id),
    enabled: !!id,
  });
};
