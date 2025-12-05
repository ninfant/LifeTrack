// Helper functions para cálculos de hábitos

// Normalize date to midnight (00:00:00)
export const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Normalize completions: convert dates to objects with normalized dateTime
export const normalizeCompletions = (completions) => {
  return completions.map((c) => {
    const d = normalizeDate(c.date);
    return {
      date: d,
      dateTime: d.getTime(),
      completed: c.completed,
    };
  });
};

// Extract only the completed dates sorted (most recent first)
export const getCompletedDates = (normalizedCompletions) => {
  return normalizedCompletions
    .filter((c) => c.completed === true)
    .map((c) => c.dateTime)
    .sort((a, b) => b - a);
};

// Calculate streaks (current and longest)
export const calculateStreaks = (completedDates) => {
  const today = normalizeDate(new Date());
  const todayTime = today.getTime();

  // Current Streak
  let currentStreak = 0;
  let checkDate = todayTime;

  for (const completedTime of completedDates) {
    const daysDiff = (checkDate - completedTime) / (1000 * 60 * 60 * 24);
    if (daysDiff === 0) {
      currentStreak++;
      checkDate -= 86400000;
    } else if (daysDiff > 0) {
      break;
    }
  }

  // Longest Streak
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

  return { current: currentStreak, longest: longestStreak };
};

// Calculate progress (weekly or monthly)
export const calculateProgress = (allCompletions, period) => {
  const today = normalizeDate(new Date());
  const todayTime = today.getTime();

  const isWeek = period === "week";
  const startDate = normalizeDate(new Date(today));
  startDate.setDate(today.getDate() - (isWeek ? 6 : 29));

  const totalDays = isWeek ? 7 : 30;
  const periodCompletions = allCompletions.filter(
    (c) => c.dateTime >= startDate.getTime() && c.dateTime <= todayTime
  );

  const completedInPeriod = periodCompletions.filter(
    (c) => c.completed === true
  ).length;
  const percentage = totalDays > 0 ? (completedInPeriod / totalDays) * 100 : 0;

  return {
    period,
    completed: completedInPeriod,
    total: totalDays,
    percentage: Math.round(percentage * 10) / 10,
  };
};

// Calculate overall statistics
export const calculateOverallStats = (completedDates, habit) => {
  const today = normalizeDate(new Date());
  const todayTime = today.getTime();

  const totalCompletions = completedDates.length;
  const habitAge = habit.createdAt
    ? Math.floor(
        (todayTime - new Date(habit.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;
  const completionRate = habitAge > 0 ? (totalCompletions / habitAge) * 100 : 0;

  return {
    totalCompletions,
    habitAgeDays: habitAge,
    completionRate: Math.round(completionRate * 10) / 10,
  };
};
