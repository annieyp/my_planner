import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChecklistItem, DayPlan, RecurringTask, TaskBank } from './types'
import { isRecurringDueOn, todayKey } from '../utils/date'

function newId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function newItem(text: string, recurringId?: string): ChecklistItem {
  return {
    id: newId(),
    text,
    done: false,
    notes: '',
    createdAt: Date.now(),
    recurringId,
  }
}

interface StoreState {
  mainItems: ChecklistItem[]
  banks: TaskBank[]
  recurringTasks: RecurringTask[]
  dayPlans: Record<string, DayPlan>

  // main today list
  addMainItem: (text: string) => void
  toggleMainItem: (id: string) => void
  deleteMainItem: (id: string) => void
  updateMainItemNotes: (id: string, notes: string) => void

  // recurring tasks
  addRecurringTask: (
    text: string,
    frequency: RecurringTask['frequency'],
    daysOfWeek: number[]
  ) => void
  deleteRecurringTask: (id: string) => void
  toggleRecurringActive: (id: string) => void
  generateDueRecurringTasks: () => void

  // task banks
  addBank: (name: string, icon: string, color: string) => void
  deleteBank: (id: string) => void
  addBankItem: (bankId: string, text: string) => void
  toggleBankItem: (bankId: string, itemId: string) => void
  deleteBankItem: (bankId: string, itemId: string) => void
  updateBankItemNotes: (bankId: string, itemId: string, notes: string) => void
  moveBankItemToToday: (bankId: string, itemId: string) => void

  // calendar day plans
  addDayPlanItem: (date: string, text: string) => void
  toggleDayPlanItem: (date: string, itemId: string) => void
  deleteDayPlanItem: (date: string, itemId: string) => void
  updateDayPlanItemNotes: (date: string, itemId: string, notes: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      mainItems: [],
      banks: [],
      recurringTasks: [],
      dayPlans: {},

      addMainItem: (text) => {
        if (!text.trim()) return
        set((s) => ({ mainItems: [...s.mainItems, newItem(text.trim())] }))
      },
      toggleMainItem: (id) => {
        set((s) => ({
          mainItems: s.mainItems.map((i) =>
            i.id === id ? { ...i, done: !i.done } : i
          ),
        }))
      },
      deleteMainItem: (id) => {
        set((s) => ({ mainItems: s.mainItems.filter((i) => i.id !== id) }))
      },
      updateMainItemNotes: (id, notes) => {
        set((s) => ({
          mainItems: s.mainItems.map((i) => (i.id === id ? { ...i, notes } : i)),
        }))
      },

      addRecurringTask: (text, frequency, daysOfWeek) => {
        if (!text.trim()) return
        const task: RecurringTask = {
          id: newId(),
          text: text.trim(),
          frequency,
          daysOfWeek,
          active: true,
          lastGeneratedDate: null,
        }
        set((s) => ({ recurringTasks: [...s.recurringTasks, task] }))
        get().generateDueRecurringTasks()
      },
      deleteRecurringTask: (id) => {
        set((s) => ({
          recurringTasks: s.recurringTasks.filter((t) => t.id !== id),
        }))
      },
      toggleRecurringActive: (id) => {
        set((s) => ({
          recurringTasks: s.recurringTasks.map((t) =>
            t.id === id ? { ...t, active: !t.active } : t
          ),
        }))
      },
      generateDueRecurringTasks: () => {
        const today = todayKey()
        const now = new Date()
        const toAdd: ChecklistItem[] = []
        const updatedTasks = get().recurringTasks.map((t) => {
          if (!t.active) return t
          if (t.lastGeneratedDate === today) return t
          if (!isRecurringDueOn(t.frequency, t.daysOfWeek, now)) return t
          toAdd.push(newItem(t.text, t.id))
          return { ...t, lastGeneratedDate: today }
        })
        if (toAdd.length === 0) return
        set((s) => ({
          recurringTasks: updatedTasks,
          mainItems: [...s.mainItems, ...toAdd],
        }))
      },

      addBank: (name, icon, color) => {
        if (!name.trim()) return
        const bank: TaskBank = { id: newId(), name: name.trim(), icon, color, items: [] }
        set((s) => ({ banks: [...s.banks, bank] }))
      },
      deleteBank: (id) => {
        set((s) => ({ banks: s.banks.filter((b) => b.id !== id) }))
      },
      addBankItem: (bankId, text) => {
        if (!text.trim()) return
        set((s) => ({
          banks: s.banks.map((b) =>
            b.id === bankId ? { ...b, items: [...b.items, newItem(text.trim())] } : b
          ),
        }))
      },
      toggleBankItem: (bankId, itemId) => {
        set((s) => ({
          banks: s.banks.map((b) =>
            b.id === bankId
              ? {
                  ...b,
                  items: b.items.map((i) =>
                    i.id === itemId ? { ...i, done: !i.done } : i
                  ),
                }
              : b
          ),
        }))
      },
      deleteBankItem: (bankId, itemId) => {
        set((s) => ({
          banks: s.banks.map((b) =>
            b.id === bankId
              ? { ...b, items: b.items.filter((i) => i.id !== itemId) }
              : b
          ),
        }))
      },
      updateBankItemNotes: (bankId, itemId, notes) => {
        set((s) => ({
          banks: s.banks.map((b) =>
            b.id === bankId
              ? {
                  ...b,
                  items: b.items.map((i) => (i.id === itemId ? { ...i, notes } : i)),
                }
              : b
          ),
        }))
      },
      moveBankItemToToday: (bankId, itemId) => {
        const bank = get().banks.find((b) => b.id === bankId)
        const item = bank?.items.find((i) => i.id === itemId)
        if (!bank || !item) return
        set((s) => ({
          banks: s.banks.map((b) =>
            b.id === bankId ? { ...b, items: b.items.filter((i) => i.id !== itemId) } : b
          ),
          mainItems: [...s.mainItems, { ...item, id: newId() }],
        }))
      },

      addDayPlanItem: (date, text) => {
        if (!text.trim()) return
        set((s) => {
          const existing = s.dayPlans[date] ?? { date, items: [] }
          return {
            dayPlans: {
              ...s.dayPlans,
              [date]: { ...existing, items: [...existing.items, newItem(text.trim())] },
            },
          }
        })
      },
      toggleDayPlanItem: (date, itemId) => {
        set((s) => {
          const existing = s.dayPlans[date]
          if (!existing) return s
          return {
            dayPlans: {
              ...s.dayPlans,
              [date]: {
                ...existing,
                items: existing.items.map((i) =>
                  i.id === itemId ? { ...i, done: !i.done } : i
                ),
              },
            },
          }
        })
      },
      deleteDayPlanItem: (date, itemId) => {
        set((s) => {
          const existing = s.dayPlans[date]
          if (!existing) return s
          return {
            dayPlans: {
              ...s.dayPlans,
              [date]: { ...existing, items: existing.items.filter((i) => i.id !== itemId) },
            },
          }
        })
      },
      updateDayPlanItemNotes: (date, itemId, notes) => {
        set((s) => {
          const existing = s.dayPlans[date]
          if (!existing) return s
          return {
            dayPlans: {
              ...s.dayPlans,
              [date]: {
                ...existing,
                items: existing.items.map((i) => (i.id === itemId ? { ...i, notes } : i)),
              },
            },
          }
        })
      },
    }),
    { name: 'scrap-planner-storage' }
  )
)
