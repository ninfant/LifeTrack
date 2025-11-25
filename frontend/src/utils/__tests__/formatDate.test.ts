import { describe, it, expect } from "vitest";
import { formatDate, getTodayString } from "../formatDate";

/**
 *
 * Tests para formatDate
 * Estructura del Test:
 * - describe: Agrupa tests relacionados
 * - it: Un test individual
 * - expect: Verifica que algo sea cierto
 */

describe("formatDate", () => {
  // Este test verifica que formatDate funciona correctamente
  it("debe formatear una fecha correctamente", () => {
    // Arrange (Preparar): Creamos los datos de entrada
    const date = new Date("2024-01-15");

    // Act (Actuar): Ejecutamos la función
    const result = formatDate(date);

    // Assert (Afirmar): Verificamos el resultado
    expect(result).toBe("15/01/2024");
  });

  it("debe formatear una fecha desde string", () => {
    const dateString = "2024-12-25";

    const result = formatDate(dateString);

    expect(result).toBe("25/12/2024");
  });

  it("debe agregar ceros a la izquierda cuando es necesario", () => {
    const date = new Date("2024-01-05");

    const result = formatDate(date);

    expect(result).toBe("05/01/2024"); // Nota el 05 con cero
  });
});

describe("getTodayString", () => {
  it("debe retornar la fecha de hoy en formato YYYY-MM-DD", () => {
    const result = getTodayString();

    // Verificamos que tenga el formato correcto
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    // Verificamos que sea una fecha válida
    const date = new Date(result);
    expect(date.toString()).not.toBe("Invalid Date");
  });
});
