import Habits from "../Models/Habits.js";

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

export const getallhabits = async (req, res) => {
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

export const gethabitbyid = async (req, res) => {
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
export const deletehabitbyid = async (req, res) => {
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

export const updatehabitbyid = async (req, res) => {
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

// Helper functions para normalización de fechas
// Normaliza una fecha a medianoche (00:00:00)
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Normaliza completions: convierte fechas a objetos con dateTime normalizado
const normalizeCompletions = (completions) => {
  return completions.map((c) => {
    const d = normalizeDate(c.date);
    return {
      date: d,
      dateTime: d.getTime(),
      completed: c.completed,
    };
  });
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

// Extrae solo las fechas completadas ordenadas (más reciente primero)
const getCompletedDates = (normalizedCompletions) => {
  return normalizedCompletions
    .filter((c) => c.completed === true)
    .map((c) => c.dateTime)
    .sort((a, b) => b - a);
};

// Calcula las rachas (current y longest)
const calculateStreaks = (completedDates) => {
  const today = normalizeDate(new Date());
  const todayTime = today.getTime();

  // Current Streak
  let currentStreak = 0;
  let checkDate = todayTime;

  for (const completedTime of completedDates) {
    const daysDiff = (checkDate - completedTime) / (1000 * 60 * 60 * 24);
    if (daysDiff === 0) {
      currentStreak++;
      checkDate -= 86400000;
    } else if (daysDiff > 0) {
      break;
    }
  }

  // Longest Streak
  let longestStreak = completedDates.length > 0 ? 1 : 0;
  let tempStreak = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const daysDiff =
      (completedDates[i - 1] - completedDates[i]) / (1000 * 60 * 60 * 24);
    if (daysDiff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
};

const calculateProgress = (allCompletions, period) => {
  const today = normalizeDate(new Date());
  const todayTime = today.getTime();

  const isWeek = period === "week";
  const startDate = normalizeDate(new Date(today));
  startDate.setDate(today.getDate() - (isWeek ? 6 : 29));

  const totalDays = isWeek ? 7 : 30;
  const periodCompletions = allCompletions.filter(
    (c) => c.dateTime >= startDate.getTime() && c.dateTime <= todayTime
  );

  const completedInPeriod = periodCompletions.filter(
    (c) => c.completed === true
  ).length;
  const percentage = totalDays > 0 ? (completedInPeriod / totalDays) * 100 : 0;

  return {
    period,
    completed: completedInPeriod,
    total: totalDays,
    percentage: Math.round(percentage * 10) / 10,
  };
};

const calculateOverallStats = (completedDates, habit) => {
  const today = normalizeDate(new Date());
  const todayTime = today.getTime();

  const totalCompletions = completedDates.length;
  const habitAge = habit.createdAt
    ? Math.floor(
        (todayTime - new Date(habit.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;
  const completionRate = habitAge > 0 ? (totalCompletions / habitAge) * 100 : 0;

  return {
    totalCompletions,
    habitAgeDays: habitAge,
    completionRate: Math.round(completionRate * 10) / 10,
  };
};

//GET HABIT STREAK - Solo rachas (más ligero)
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

//GET HABIT STATS - Estadísticas completas (streak + progreso + overall)
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

    // Calcular todas las estadísticas usando helpers
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
