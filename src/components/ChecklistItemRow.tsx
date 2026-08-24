import { useState } from 'react'
import type { ChecklistItem } from '../store/types'

interface Props {
  item: ChecklistItem
  index?: number
  onToggle: () => void
  onDelete: () => void
  onUpdateNotes: (notes: string) => void
  moveLabel?: string
  onMove?: () => void
}

export default function ChecklistItemRow({
  item,
  index,
  onToggle,
  onDelete,
  onUpdateNotes,
  moveLabel,
  onMove,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="checklist-row">
      <div className="checklist-row-main">
        {typeof index === 'number' && <span className="checklist-index">{index}.</span>}
        <button
          className={`checkbox ${item.done ? 'done' : ''}`}
          onClick={onToggle}
          aria-label="toggle done"
        >
          {item.done ? '✓' : ''}
        </button>
        <span className={`checklist-text ${item.done ? 'done' : ''}`}>{item.text}</span>
        <div className="checklist-actions">
          {onMove && (
            <button className="checklist-move-btn" onClick={onMove}>
              {moveLabel ?? '→ today'}
            </button>
          )}
          <button
            className="checklist-mini-btn"
            title="add specifics"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? '▲' : '✎'}
          </button>
          <button className="checklist-mini-btn" title="delete" onClick={onDelete}>
            ✕
          </button>
        </div>
      </div>
      {expanded && (
        <textarea
          className="checklist-notes"
          placeholder="specifics, notes, details..."
          value={item.notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
        />
      )}
    </div>
  )
}
