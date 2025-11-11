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
