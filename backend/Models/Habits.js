import mongoose from "mongoose";

const habitsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  objective: {
    type: String,
    required: true,
  },

  //completions es un array de objetos con date y completed
  completions: [
    {
      date: Date,
      completed: Boolean,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Habits = mongoose.model("Habits", habitsSchema);

export default Habits;
