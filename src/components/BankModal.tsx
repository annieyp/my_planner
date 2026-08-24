import { useStore } from '../store/useStore'
import Modal from './Modal'
import ChecklistItemRow from './ChecklistItemRow'
import AddItemRow from './AddItemRow'

export default function BankModal({
  bankId,
  onClose,
}: {
  bankId: string
  onClose: () => void
}) {
  const bank = useStore((s) => s.banks.find((b) => b.id === bankId))
  const addBankItem = useStore((s) => s.addBankItem)
  const toggleBankItem = useStore((s) => s.toggleBankItem)
  const deleteBankItem = useStore((s) => s.deleteBankItem)
  const updateBankItemNotes = useStore((s) => s.updateBankItemNotes)
  const moveBankItemToToday = useStore((s) => s.moveBankItemToToday)
  const deleteBank = useStore((s) => s.deleteBank)

  if (!bank) return null

  return (
    <Modal title={`${bank.icon} ${bank.name}`} onClose={onClose}>
      <div className="bank-modal-header">
        <span className="form-label">task bank</span>
        <button
          className="delete-bank-btn"
          onClick={() => {
            deleteBank(bank.id)
            onClose()
          }}
        >
          delete bank
        </button>
      </div>
      <div className="checklist">
        {bank.items.length === 0 && <div className="checklist-empty">empty for now ✎</div>}
        {bank.items.map((item) => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            onToggle={() => toggleBankItem(bank.id, item.id)}
            onDelete={() => deleteBankItem(bank.id, item.id)}
            onUpdateNotes={(notes) => updateBankItemNotes(bank.id, item.id, notes)}
            moveLabel="→ today"
            onMove={() => moveBankItemToToday(bank.id, item.id)}
          />
        ))}
      </div>
      <AddItemRow placeholder="add a task to this bank..." onAdd={(text) => addBankItem(bank.id, text)} />
    </Modal>
  )
}
