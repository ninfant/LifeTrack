import Habits from "../Models/Habits.js";

export const createHabits = async (req, res) => {
  const { name, description, userId } = req.body;
  try {
    if (!name || !description || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newhabit = await Habits.create({ name, description, userId });
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
  const { name, description, completed } = req.body;
  try {
    const updatedhabit = await Habits.findByIdAndUpdate(
      id,
      { name, description, completed },
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
    const completionDate = date ? new Date(date) : new Date();
    completionDate.setHours(0, 0, 0, 0); // Normalizar a medianoche

    // Buscar si ya existe un registro para esta fecha
    const existingIndex = habit.completions.findIndex((c) => {
      const cDate = new Date(c.date);
      cDate.setHours(0, 0, 0, 0);
      return cDate.getTime() === completionDate.getTime();
    });

    if (existingIndex !== -1) {
      // Si existe, actualizar
      habit.completions[existingIndex].completed = completed;
    } else {
      // Si no existe, agregar nuevo
      habit.completions.push({
        date: completionDate,
        completed: completed !== undefined ? completed : true,
      });
    }

    await habit.save();

    res.status(200).json({
      message: "Habit completion logged successfully",
      habit,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

//GET HABIT STREAK
export const getHabitStreak = async (req, res) => {
  const { id } = req.params;
  try {
    const habit = await Habits.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Solo días completados, ordenados por fecha
    const completedDates = habit.completions
      .filter((c) => c.completed === true)
      .map((c) => {
        const d = new Date(c.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime(); // Convertir a número para comparar fácil
      })
      .sort((a, b) => b - a); // Más reciente primero

    // Current Streak: desde hoy hacia atrás
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    let currentStreak = 0;
    let checkDate = todayTime;

    for (const completedTime of completedDates) {
      const daysDiff = (checkDate - completedTime) / (1000 * 60 * 60 * 24);

      if (daysDiff === 0) {
        // Este día está completado
        currentStreak++;
        checkDate -= 86400000; // Restar 1 día (en milisegundos)
      } else if (daysDiff > 0) {
        // Hay un gap, rompe la racha
        break;
      }
    }

    // Longest Streak: la secuencia más larga
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

    res.status(200).json({
      currentStreak,
      longestStreak,
      habitId: id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
