// backend/controllers/__tests__/habitsController.test.js
import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { createHabits } from "../habitsController.js";
import Habits from "../../Models/Habits.js";

describe("createHabits", () => {
  let req, res;
  let createSpy;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Crear spy del método create
    createSpy = jest.spyOn(Habits, "create");
  });

  afterEach(() => {
    // Restaurar mocks después de cada test
    jest.restoreAllMocks();
  });

  it("debe crear un hábito exitosamente", async () => {
    req.body = {
      name: "Hacer ejercicio",
      description: "30 minutos diarios",
      userId: "123",
    };

    const mockHabit = {
      _id: "456",
      name: req.body.name,
      description: req.body.description,
      userId: req.body.userId,
    };

    createSpy.mockResolvedValue(mockHabit);

    await createHabits(req, res);

    expect(createSpy).toHaveBeenCalledWith({
      name: req.body.name,
      description: req.body.description,
      userId: req.body.userId,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "new habit created successfully",
      })
    );
  });

  it("debe retornar 400 si falta name", async () => {
    req.body = { description: "test", userId: "123" };

    await createHabits(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });
});
