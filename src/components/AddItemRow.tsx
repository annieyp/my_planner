import { useState } from 'react'

export default function AddItemRow({
  placeholder,
  onAdd,
}: {
  placeholder: string
  onAdd: (text: string) => void
}) {
  const [value, setValue] = useState('')

  const submit = () => {
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }

  return (
    <div className="add-item-row">
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
      />
      <button className="btn-sticker" onClick={submit}>
        add
      </button>
    </div>
  )
}
