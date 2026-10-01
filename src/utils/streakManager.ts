// src/utils/streakManager.ts
export interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_active_days: number;
  is_active_today: boolean;
  past_7_days: Array<{
    date: string;
    day_label: string;
    is_active: boolean;
    is_today: boolean;
  }>;
}

export const DEFAULT_STREAK: StreakData = {
  current_streak: 1,
  longest_streak: 1,
  total_active_days: 1,
  is_active_today: true,
  past_7_days: [
    { date: "", day_label: "Mon", is_active: false, is_today: false },
    { date: "", day_label: "Tue", is_active: false, is_today: false },
    { date: "", day_label: "Wed", is_active: false, is_today: false },
    { date: "", day_label: "Thu", is_active: false, is_today: false },
    { date: "", day_label: "Fri", is_active: true, is_today: true },
    { date: "", day_label: "Sat", is_active: false, is_today: false },
    { date: "", day_label: "Sun", is_active: false, is_today: false },
  ]
};

export async function logActivity(rollNumber: string): Promise<StreakData | null> {
  try {
    const res = await fetch("/api/student/activity/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roll_number: rollNumber })
    });
    if (res.ok) {
      const data = await res.json();
      return data.streak;
    }
  } catch (err) {
    console.warn("Streak sync note:", err);
  }
  return null;
}
