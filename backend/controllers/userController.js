import User from "../Models/User.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
  res.status(200).json({ users });
};
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const userbyId = await User.findById(id);
    if (!userbyId) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User Found successfully", user: userbyId });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
