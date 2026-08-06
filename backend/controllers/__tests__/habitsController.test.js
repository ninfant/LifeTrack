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
      status: jest.fn().mockReturnThis(), //crea funciones mock para el status y el json
      json: jest.fn(), //crea funciones mock para el json
    };

    createSpy = jest.spyOn(Habits, "create"); //espiamos el metodo create de la clase Habits
  });

  afterEach(() => {
    jest.restoreAllMocks(); //restaura los mocks después de cada test
  });

  it("debe crear un hábito exitosamente", async () => {
    req.body = {
      name: "Hacer ejercicio",
      category: "Salud",
      objective: "30 minutos diarios",
      userId: "123",
    };
    //respuesta simulada de la BD
    const mockHabit = {
      _id: "456",
      name: req.body.name,
      category: req.body.category,
      objective: req.body.objective,
      userId: req.body.userId,
    };
    //hace que el spy devuelva una promesa resuelta
    createSpy.mockResolvedValue(mockHabit);

    await createHabits(req, res);
    //verifica que el spy haya sido llamado con los argumentos correctos
    expect(createSpy).toHaveBeenCalledWith({
      name: req.body.name,
      category: req.body.category,
      objective: req.body.objective,
      userId: req.body.userId,
    });
    //verifica que el status y el json hayan sido llamados con los argumentos correctos
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "new habit created successfully",
      })
    );
  });

  it("debe retornar 400 si falta name", async () => {
    req.body = { category: "Salud", objective: "test", userId: "123" };

    await createHabits(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });
});
