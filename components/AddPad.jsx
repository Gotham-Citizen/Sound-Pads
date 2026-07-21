import { useState, useMemo, useRef, useEffect } from "react"

const MAX_FILE_SIZE = 4 * 1024 * 1024

function getRandomUnusedColor(existingColors) {
  const used = new Set(existingColors.map(c => c.toLowerCase()))
  for (let i = 0; i < 20; i++) {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")
    if (!used.has(hex.toLowerCase())) {
      return hex
    }
  }
  return "#CCCCCC"
}

export default function AddPad({ onAdd, existingKeys, existingColors }) {
  const [label, setLabel] = useState("")
  const [color, setColor] = useState(() => getRandomUnusedColor(existingColors))
  const [key, setKey] = useState("")
  const [file, setFile] = useState(null)
  const [keyWarning, setKeyWarning] = useState("")
  const [fileWarning, setFileWarning] = useState("")
  const labelInputRef = useRef(null)

  useEffect(() => {
    labelInputRef.current?.focus()
  }, [])

  const normalizedExistingColors = useMemo(() => existingColors.map(c => c.toLowerCase()), [existingColors])

  const colorIsDuplicate = normalizedExistingColors.includes(color.toLowerCase())
  const colorWarning = colorIsDuplicate ? "This color is already used" : ""

  const handleKeyChange = (e) => {
    const val = e.target.value.slice(-1)
    setKey(val)
    if (val && existingKeys.some(k => k === val)) {
      setKeyWarning("This key is already assigned")
    } else {
      setKeyWarning("")
    }
  }

  const handleColorChange = (e) => {
    const val = e.target.value
    setColor(val)
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f && f.size > MAX_FILE_SIZE) {
      setFileWarning("File exceeds 4MB limit")
    } else {
      setFileWarning("")
    }
  }

  const canSubmit = label.trim() && file && !keyWarning && !colorWarning && !fileWarning

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.error) {
        setFileWarning("Failed to read file")
        return
      }
      const ok = onAdd({
        label: label.trim(),
        color,
        key: key || null,
        soundDataUrl: reader.result
      })
      if (ok) {
        setLabel("")
        setColor(getRandomUnusedColor(existingColors))
        setKey("")
        setFile(null)
        setKeyWarning("")
        setFileWarning("")
        e.target.reset()
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <form className="add-pad-form" onSubmit={handleSubmit}>
      <h3>Add Sound Pad</h3>
      <div className="form-row">
        <label>Name:</label>
        <input
          type="text"
          ref={labelInputRef}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Sound name"
          required
        />
      </div>
      <div className="form-row">
        <label>Color:</label>
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className={colorWarning ? "key-input-warn" : ""}
        />
        {colorWarning && <span className="key-warning">{colorWarning}</span>}
      </div>
      <div className="form-row">
        <label>Key:</label>
        <input
          type="text"
          value={key}
          onChange={handleKeyChange}
          placeholder="e.g. q"
          maxLength={1}
          className={keyWarning ? "key-input-warn" : ""}
        />
        {keyWarning && <span className="key-warning">{keyWarning}</span>}
      </div>
      <div className="form-row">
        <label>Sound:</label>
        <input
          type="file"
          accept=".mp3,.wav,.ogg,.flac,.aac,.m4a,.webm,audio/mpeg,audio/wav,audio/ogg,audio/flac,audio/aac,audio/mp4,audio/webm"
          onChange={handleFileChange}
          className={fileWarning ? "key-input-warn" : ""}
          required
        />
        {fileWarning && <span className="key-warning">{fileWarning}</span>}
      </div>
      <button type="submit" className="add-btn" disabled={!canSubmit}>Add Pad</button>
    </form>
  )
}