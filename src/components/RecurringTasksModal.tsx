import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { RecurringFrequency } from '../store/types'
import Modal from './Modal'

const WEEKDAY_CHIPS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const FREQ_LABEL: Record<RecurringFrequency, string> = {
  daily: 'every day',
  weekdays: 'mon–fri',
  weekly: 'custom days',
}

export default function RecurringTasksModal({ onClose }: { onClose: () => void }) {
  const recurringTasks = useStore((s) => s.recurringTasks)
  const addRecurringTask = useStore((s) => s.addRecurringTask)
  const deleteRecurringTask = useStore((s) => s.deleteRecurringTask)
  const toggleRecurringActive = useStore((s) => s.toggleRecurringActive)

  const [text, setText] = useState('')
  const [frequency, setFrequency] = useState<RecurringFrequency>('daily')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([])

  const submit = () => {
    if (!text.trim()) return
    addRecurringTask(text, frequency, frequency === 'weekly' ? daysOfWeek : [])
    setText('')
    setDaysOfWeek([])
  }

  const toggleDay = (d: number) => {
    setDaysOfWeek((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]))
  }

  return (
    <Modal title="↻ recurring tasks" onClose={onClose}>
      <p className="form-label">these auto-add to today's checklist</p>

      <input
        style={{ width: '100%', marginTop: 8, marginBottom: 12 }}
        placeholder="e.g. drink water, journal, gym..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />

      <div className="freq-tabs">
        {(['daily', 'weekdays', 'weekly'] as RecurringFrequency[]).map((f) => (
          <button
            key={f}
            className={`freq-tab ${frequency === f ? 'selected' : ''}`}
            onClick={() => setFrequency(f)}
            type="button"
          >
            {FREQ_LABEL[f]}
          </button>
        ))}
      </div>

      {frequency === 'weekly' && (
        <div className="weekday-picker">
          {WEEKDAY_CHIPS.map((label, i) => (
            <button
              key={i}
              className={`weekday-chip ${daysOfWeek.includes(i) ? 'selected' : ''}`}
              onClick={() => toggleDay(i)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <button className="btn-sticker" style={{ width: '100%' }} onClick={submit}>
        add recurring task
      </button>

      <hr className="divider" />

      <p className="form-label">active recurring tasks</p>
      <div className="recurring-list">
        {recurringTasks.length === 0 && (
          <div className="checklist-empty">none yet — add one above ✎</div>
        )}
        {recurringTasks.map((t) => (
          <div key={t.id} className={`recurring-row ${t.active ? '' : 'inactive'}`}>
            <button
              className={`checkbox ${t.active ? 'done' : ''}`}
              onClick={() => toggleRecurringActive(t.id)}
              title="toggle active"
            >
              {t.active ? '✓' : ''}
            </button>
            <span className="rt-text">{t.text}</span>
            <span className="rt-freq">
              {t.frequency === 'weekly'
                ? t.daysOfWeek.map((d) => WEEKDAY_CHIPS[d]).join('') || 'weekly'
                : FREQ_LABEL[t.frequency]}
            </span>
            <button className="checklist-mini-btn" onClick={() => deleteRecurringTask(t.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </Modal>
  )
}
