import { useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useStore } from '../store/useStore'
import { toDateKey } from '../utils/date'
import DayPlanModal from './DayPlanModal'
import '../styles/calendar.css'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarView({ onBack }: { onBack: () => void }) {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const dayPlans = useStore((s) => s.dayPlans)

  const gridStart = startOfWeek(startOfMonth(monthCursor))
  const gridEnd = endOfWeek(endOfMonth(monthCursor))
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })
  const today = new Date()

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
        <h1 className="screen-title">calendar</h1>
        <div className="calendar-nav">
          <button onClick={() => setMonthCursor((m) => subMonths(m, 1))}>‹</button>
          <span>{format(monthCursor, 'MMMM yyyy')}</span>
          <button onClick={() => setMonthCursor((m) => addMonths(m, 1))}>›</button>
        </div>
      </div>

      <div className="calendar-grid-wrap">
        <div className="calendar-weekdays">
          {WEEKDAY_LABELS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((day) => {
            const key = toDateKey(day)
            const plan = dayPlans[key]
            const hasItems = plan && plan.items.length > 0
            return (
              <button
                key={key}
                className={`calendar-cell ${isSameMonth(day, monthCursor) ? '' : 'other-month'} ${
                  isSameDay(day, today) ? 'today' : ''
                }`}
                onClick={() => setSelectedDate(key)}
              >
                <span className="day-num">{format(day, 'd')}</span>
                {hasItems && <span className="plan-dot" />}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <DayPlanModal date={selectedDate} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  )
}
