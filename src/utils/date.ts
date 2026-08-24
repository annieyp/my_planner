export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function isRecurringDueOn(
  frequency: 'daily' | 'weekdays' | 'weekly',
  daysOfWeek: number[],
  date: Date
): boolean {
  const dow = date.getDay()
  if (frequency === 'daily') return true
  if (frequency === 'weekdays') return dow >= 1 && dow <= 5
  return daysOfWeek.includes(dow)
}
