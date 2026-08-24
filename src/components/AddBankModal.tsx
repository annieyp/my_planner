import { useState } from 'react'
import { useStore } from '../store/useStore'
import Modal from './Modal'

const ICONS = ['📚', '💼', '🛒', '💌', '🎀', '🐾', '🌷', '🍓', '🎧', '📎', '🧷', '✨']
const COLORS = ['#ffd3e6', '#cdeee0', '#fdeea4', '#e3d9fb', '#cfe8ff', '#ffe0c2']

export default function AddBankModal({ onClose }: { onClose: () => void }) {
  const addBank = useStore((s) => s.addBank)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [color, setColor] = useState(COLORS[0])

  const submit = () => {
    if (!name.trim()) return
    addBank(name, icon, color)
    onClose()
  }

  return (
    <Modal title="new task bank" onClose={onClose}>
      <p className="form-label">name</p>
      <input
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="e.g. work, groceries, someday..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        autoFocus
      />

      <p className="form-label">icon</p>
      <div className="icon-picker">
        {ICONS.map((i) => (
          <button
            key={i}
            className={i === icon ? 'selected' : ''}
            onClick={() => setIcon(i)}
            type="button"
          >
            {i}
          </button>
        ))}
      </div>

      <p className="form-label">color</p>
      <div className="color-picker">
        {COLORS.map((c) => (
          <button
            key={c}
            className={`color-swatch ${c === color ? 'selected' : ''}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            type="button"
          />
        ))}
      </div>

      <button className="btn-sticker" style={{ width: '100%' }} onClick={submit}>
        create bank
      </button>
    </Modal>
  )
}
