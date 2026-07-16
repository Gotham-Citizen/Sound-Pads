import padsData from "./pads"
import { useState, useEffect, useCallback, useMemo } from "react"
import Pad from "../components/Pad"
import AddPad from "../components/AddPad"

const VOLUME_STEP = 0.05
const INITIAL_VOLUME = 0.5
const STORAGE_KEY = "sound-pads-custom"

function loadCustomPads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(p => p && typeof p.id === "number" && p.sound)
  } catch {
    return []
  }
}

export default function App() {
  const [customPads, setCustomPads] = useState(loadCustomPads)
  const [padsState, setPadsState] = useState(padsData)
  const [volume, setVolume] = useState(INITIAL_VOLUME)
  const [showAddPad, setShowAddPad] = useState(false)
  const [storageError, setStorageError] = useState("")

  function saveCustomPads(pads) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pads))
      setStorageError("")
      return true
    } catch {
      setStorageError("Storage full\u2014delete some custom pads or use smaller files")
      return false
    }
  }

  const pads = useMemo(() => [...padsState, ...customPads], [padsState, customPads])

  const allKeys = pads.map(p => p.key).filter(Boolean)
  const allColors = pads.map(p => p.color).filter(Boolean)

  const toggle = useCallback((id) => {
    setCustomPads(prev => {
      const found = prev.some(p => p.id === id)
      if (found) {
        const next = prev.map(pad =>
          pad.id === id ? { ...pad, on: !pad.on } : pad
        )
        return saveCustomPads(next) ? next : prev
      }
      return prev
    })
    setPadsState(prev => prev.map(pad =>
      pad.id === id ? { ...pad, on: !pad.on } : pad
    ))
  }, [])

  const handleVolumeChange = useCallback((e) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      setVolume(val)
    }
  }, [])

  const addPad = useCallback(({ label, color, key, soundDataUrl }) => {
    const id = Date.now()
    const newPad = {
      id,
      color,
      key: key || null,
      label,
      sound: soundDataUrl,
      on: false,
      isCustom: true
    }
    setCustomPads(prev => {
      const next = [...prev, newPad]
      return saveCustomPads(next) ? next : prev
    })
  }, [])

  const deletePad = useCallback((id) => {
    setCustomPads(prev => {
      const next = prev.filter(p => p.id !== id)
      return saveCustomPads(next) ? next : prev
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.isContentEditable) {
        return
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        setVolume(v => Math.max(0, v - VOLUME_STEP))
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        setVolume(v => Math.min(1, v + VOLUME_STEP))
      }

      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        const matched = pads.find(p => p.key && p.key.toLowerCase() === e.key.toLowerCase())
        if (matched) {
          e.preventDefault()
          toggle(matched.id)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggle, pads])

  const reorderPads = useCallback((fromIndex, toIndex) => {
    const customStart = fromIndex - padsState.length
    const customEnd = toIndex - padsState.length
    if (customStart < 0 || customEnd < 0) return
    setCustomPads(prev => {
      const next = [...prev]
      const [moved] = next.splice(customStart, 1)
      next.splice(customEnd, 0, moved)
      return saveCustomPads(next) ? next : prev
    })
  }, [padsState.length])

  const buttonElements = pads.map((pad, i) =>
    <Pad
      key={pad.id}
      id={pad.id}
      color={pad.color}
      on={pad.on}
      toggle={toggle}
      sound={pad.sound}
      volume={volume}
      isCustom={pad.isCustom || false}
      label={pad.label || ""}
      onDelete={deletePad}
      index={i}
      onReorder={reorderPads}
    />
  )

  return (
    <main>
      <div className="volume-container">
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>
      <div className="pad-container">
        {buttonElements}
        <button onClick={() => setShowAddPad(prev => !prev)} className="add-pad-toggle-btn">
          +
        </button>
        {showAddPad && <AddPad onAdd={addPad} existingKeys={allKeys} existingColors={allColors} />}
      </div>
      {storageError && <p className="key-warning" style={{ textAlign: "center", marginTop: 8 }}>{storageError}</p>}
    </main>
  )
}