import Habits from "../Models/Habits.js";
import {
  normalizeDate,
  normalizeCompletions,
  getCompletedDates,
  calculateStreaks,
  calculateProgress,
  calculateOverallStats,
} from "../helpers/habitsHelpers.js";

export const createHabits = async (req, res) => {
  const { name, category, objective, userId } = req.body;
  try {
    if (!name || !category || !objective || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newhabit = await Habits.create({ name, category, objective, userId });
    res
      .status(201)
      .json({ message: "new habit created successfully", newhabit });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllHabits = async (req, res) => {
  const { userId } = req.params;
  try {
    const allhabits = await Habits.find({ userId });
    if (!allhabits) {
      return res.status(404).json({ message: "No habits found" });
    }
    res
      .status(200)
      .json({ message: "All habits fetched successfully", allhabits });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getHabitById = async (req, res) => {
  const { id } = req.params;
  try {
    const habitbyid = await Habits.findById(id);
    if (!habitbyid) {
      return res.status(404).json({ message: "Habit not found" });
    }
    res.status(200).json({ message: "Habit found successfully", habitbyid });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const deleteHabitById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedhabit = await Habits.findByIdAndDelete(id);
    if (!deletedhabit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    res
      .status(200)
      .json({ message: "Habit deleted successfully", deletedhabit });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateHabitById = async (req, res) => {
  const { id } = req.params;
  const { name, category, objective } = req.body;
  try {
    const updatedhabit = await Habits.findByIdAndUpdate(
      id,
      { name, category, objective },
      { new: true }
    );
    if (!updatedhabit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    res
      .status(200)
      .json({ message: "Habit updated successfully", updatedhabit });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

//LOG HABIT COMPLETION
export const logHabitCompletion = async (req, res) => {
  const { id } = req.params; // habitId
  const { date, completed } = req.body; // date es opcional, completed es true/false

  try {
    const habit = await Habits.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Si no se envía fecha, usar hoy
    const completionDate = normalizeDate(date || new Date());

    // Buscar si ya existe un registro para esta fecha
    const existingIndex = habit.completions.findIndex((c) => {
      const cDate = normalizeDate(c.date);
      return cDate.getTime() === completionDate.getTime();
    }); //existingIndex = el indice del registro que ya existe o -1 si no existe

    if (existingIndex !== -1) {
      habit.completions[existingIndex].completed = completed; // Si existe, actualizar
    } else {
      // Si no existe, agregar nuevo
      habit.completions.push({
        date: completionDate,
        completed: completed !== undefined ? completed : true,
      }); /** si el registro SI se envia(!== undefined ), es decir ya sea true o false la variable completed lo toma,
       si no se envio, se completa el registro por defecto con true, esto es para que se pueda marcar el día como completado 
      * */
    }

    await habit.save(); //guardamos el habit en la base de datos

    res
      .status(200)
      .json({ message: "Habit completion logged successfully", habit }); //respuesta exitosa
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error }); //respuesta de error
  }
};

//GET HABIT STREAK - Only streaks (lighter)
export const getHabitStreak = async (req, res) => {
  const { id } = req.params;
  try {
    const habit = await Habits.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const normalizedCompletions = normalizeCompletions(habit.completions);
    const completedDates = getCompletedDates(normalizedCompletions);
    const streaks = calculateStreaks(completedDates);

    res.status(200).json({
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      habitId: id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

//GET HABIT STATS - Complete statistics (streak + progress + overall)
export const getHabitStats = async (req, res) => {
  const { id } = req.params;
  const { period = "week" } = req.query;

  try {
    const habit = await Habits.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const normalizedCompletions = normalizeCompletions(habit.completions);
    const completedDates = getCompletedDates(normalizedCompletions);

    // Calculate all statistics using helpers
    const streaks = calculateStreaks(completedDates);
    const progress = calculateProgress(normalizedCompletions, period);
    const overall = calculateOverallStats(completedDates, habit);

    res.status(200).json({
      habitId: id,
      habitName: habit.name,
      streaks,
      progress,
      overall,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
