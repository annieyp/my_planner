export interface ChecklistItem {
  id: string
  text: string
  done: boolean
  notes: string
  createdAt: number
  /** id of the RecurringTask that generated this item, if any */
  recurringId?: string
}

export type RecurringFrequency = 'daily' | 'weekdays' | 'weekly'

export interface RecurringTask {
  id: string
  text: string
  frequency: RecurringFrequency
  /** 0 = Sunday ... 6 = Saturday, only used when frequency === 'weekly' */
  daysOfWeek: number[]
  active: boolean
  /** yyyy-mm-dd of the last day this task was generated into the main list */
  lastGeneratedDate: string | null
}

export interface TaskBank {
  id: string
  name: string
  icon: string
  color: string
  items: ChecklistItem[]
}

export interface DayPlan {
  date: string
  items: ChecklistItem[]
}
