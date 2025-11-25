// Tests para formatStreak
import { describe, it, expect } from "vitest";
import { formatStreak, getStreakMessage } from "../formatStreak";

describe("formatStreak", () => {
  it('debe retornar "Sin racha" cuando streak es 0', () => {
    const result = formatStreak(0);
    expect(result).toBe("Sin racha");
  });

  it('debe retornar "1 día" cuando streak es 1', () => {
    const result = formatStreak(1);
    expect(result).toBe("1 día");
  });

  it("debe retornar formato plural para streaks mayores a 1", () => {
    expect(formatStreak(2)).toBe("2 días");
    expect(formatStreak(10)).toBe("10 días");
    expect(formatStreak(100)).toBe("100 días");
  });
});

describe("getStreakMessage", () => {
  it("debe retornar mensaje motivacional para streak 0", () => {
    const result = getStreakMessage(0);
    expect(result).toBe("¡Empieza tu racha hoy!");
  });

  it("debe retornar mensaje para streak menor a 7", () => {
    expect(getStreakMessage(1)).toBe("¡Sigue así!");
    expect(getStreakMessage(6)).toBe("¡Sigue así!");
  });

  it("debe retornar mensaje para streak menor a 30", () => {
    expect(getStreakMessage(7)).toBe("¡Excelente progreso!");
    expect(getStreakMessage(29)).toBe("¡Excelente progreso!");
  });

  it("debe retornar mensaje para streak mayor o igual a 30", () => {
    expect(getStreakMessage(30)).toBe("¡Eres increíble!");
    expect(getStreakMessage(100)).toBe("¡Eres increíble!");
  });
});
