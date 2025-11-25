// Streak formatting utilities

/**
 * Formatea un número de streak a texto legible
 * @param streak - Número de días de racha
 * @returns String formateado
 */
export const formatStreak = (streak: number): string => {
  if (streak === 0) return "Sin racha";
  if (streak === 1) return "1 día";
  return `${streak} días`;
};

/**
 * Obtiene un mensaje motivacional basado en la racha
 * @param streak - Número de días de racha
 * @returns Mensaje motivacional
 */
export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return "¡Empieza tu racha hoy!";
  if (streak < 7) return "¡Sigue así!";
  if (streak < 30) return "¡Excelente progreso!";
  return "¡Eres increíble!";
};

/**digamos q en el backend yo tengo un metodo de streak relacionado con los dias q debe completar para hacer un streak y tod oeso, eso ta,bien no lo tengo q hacer unit test? puedo hacerlo, necesito instalar todo en el backend tamnbien ? como normalmente se hacen las unit test solo en el backend o solo en el frontend ? */
