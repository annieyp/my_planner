import { format, parseISO } from 'date-fns'
import { useStore } from '../store/useStore'
import Modal from './Modal'
import ChecklistItemRow from './ChecklistItemRow'
import AddItemRow from './AddItemRow'
import '../styles/checklist.css'

export default function DayPlanModal({
  date,
  onClose,
}: {
  date: string
  onClose: () => void
}) {
  const plan = useStore((s) => s.dayPlans[date])
  const addDayPlanItem = useStore((s) => s.addDayPlanItem)
  const toggleDayPlanItem = useStore((s) => s.toggleDayPlanItem)
  const deleteDayPlanItem = useStore((s) => s.deleteDayPlanItem)
  const updateDayPlanItemNotes = useStore((s) => s.updateDayPlanItemNotes)

  const items = plan?.items ?? []

  return (
    <Modal title="plan this day" onClose={onClose}>
      <div className="day-plan-date">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</div>
      <div className="checklist">
        {items.length === 0 && <div className="checklist-empty">nothing planned yet ✎</div>}
        {items.map((item, i) => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            index={i + 1}
            onToggle={() => toggleDayPlanItem(date, item.id)}
            onDelete={() => deleteDayPlanItem(date, item.id)}
            onUpdateNotes={(notes) => updateDayPlanItemNotes(date, item.id, notes)}
          />
        ))}
      </div>
      <AddItemRow placeholder="add a plan item..." onAdd={(text) => addDayPlanItem(date, text)} />
    </Modal>
  )
}
