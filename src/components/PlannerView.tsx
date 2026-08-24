import { useState } from 'react'
import { format } from 'date-fns'
import { useStore } from '../store/useStore'
import ChecklistItemRow from './ChecklistItemRow'
import AddItemRow from './AddItemRow'
import BankModal from './BankModal'
import AddBankModal from './AddBankModal'
import RecurringTasksModal from './RecurringTasksModal'
import '../styles/planner.css'
import '../styles/checklist.css'

export default function PlannerView({ onBack }: { onBack: () => void }) {
  const mainItems = useStore((s) => s.mainItems)
  const addMainItem = useStore((s) => s.addMainItem)
  const toggleMainItem = useStore((s) => s.toggleMainItem)
  const deleteMainItem = useStore((s) => s.deleteMainItem)
  const updateMainItemNotes = useStore((s) => s.updateMainItemNotes)
  const banks = useStore((s) => s.banks)

  const [openBankId, setOpenBankId] = useState<string | null>(null)
  const [showAddBank, setShowAddBank] = useState(false)
  const [showRecurring, setShowRecurring] = useState(false)

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
        <h1 className="screen-title">planner</h1>
      </div>

      <div className="planner-body">
        <div className="planner-main">
          <div className="today-label">today — {format(new Date(), 'EEEE, MMMM d')}</div>
          <div className="planner-main-scroll">
            <div className="checklist">
              {mainItems.length === 0 && (
                <div className="checklist-empty">nothing on today's list yet ✎</div>
              )}
              {mainItems.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  onToggle={() => toggleMainItem(item.id)}
                  onDelete={() => deleteMainItem(item.id)}
                  onUpdateNotes={(notes) => updateMainItemNotes(item.id, notes)}
                />
              ))}
            </div>
          </div>
          <AddItemRow placeholder="add a task for today..." onAdd={addMainItem} />
        </div>

        <div className="planner-side">
          <div className="side-card">
            <h3>↻ recurring</h3>
            <button
              className="btn-sticker recurring-btn-full"
              onClick={() => setShowRecurring(true)}
            >
              manage recurring tasks
            </button>
          </div>

          <div className="side-card">
            <h3>task banks</h3>
            <div className="bank-grid">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  className="bank-icon-btn"
                  style={{ background: bank.color }}
                  onClick={() => setOpenBankId(bank.id)}
                >
                  <span className="emoji">{bank.icon}</span>
                  <span>{bank.name}</span>
                </button>
              ))}
              <button className="bank-icon-btn add-bank" onClick={() => setShowAddBank(true)}>
                <span className="emoji">+</span>
                <span>new bank</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {openBankId && (
        <BankModal bankId={openBankId} onClose={() => setOpenBankId(null)} />
      )}
      {showAddBank && <AddBankModal onClose={() => setShowAddBank(false)} />}
      {showRecurring && <RecurringTasksModal onClose={() => setShowRecurring(false)} />}
    </div>
  )
}
