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

//GET HABIT STREAK(racha de días completados)
export const getHabitStreak = async (req, res) => {
  const { id } = req.params;
  try {
    const habit = await Habits.findById(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Solo días completados,transformados a números y ordenados por fecha
    const completedDates = habit.completions
      .filter((c) => c.completed === true)
      .map((c) => {
        const d = new Date(c.date); //"2024-01-15" => "2024-01-15T00:00:03:333Z"
        d.setHours(0, 0, 0, 0); //"2024-01-15T00:00:03:333Z" => "2024-01-15T00:00:00:000Z"
        return d.getTime(); // => 1736937600000 //transformar a número para comparar fácil
      })
      .sort((a, b) => b - a); // Más reciente primero

    // Current Streak: desde hoy hacia atrás
    const today = new Date(); //
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime(); // => 1337203200000 //transformar a número para comparar fácil

    let currentStreak = 0;
    let checkDate = todayTime;

    //calcula la racha actual contando días consecutivos completados desde hoy hacia atrás.si hay un gap, rompe la racha.
    for (const completedTime of completedDates) {
      const daysDiff = (checkDate - completedTime) / (1000 * 60 * 60 * 24);

      if (daysDiff === 0) {
        // Este día está completado
        currentStreak++; //incrementar la racha
        checkDate -= 86400000; // Retroceder el checkDate 1 día (en milisegundos)
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
