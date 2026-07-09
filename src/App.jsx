import padsData from "./pads"
import { useState, useEffect, useCallback } from "react"
import Pad from "../components/Pad"

const VOLUME_STEP = 0.05
const INITIAL_VOLUME = 0.5

export default function App() {
  const [pads, setPads] = useState(padsData)
  const [volume, setVolume] = useState(INITIAL_VOLUME)

  const toggle = useCallback((id) => {
    setPads(prevPads => prevPads.map(pad =>
      pad.id === id ? { ...pad, on: !pad.on } : pad
    ))
  }, [])

  const handleVolumeChange = useCallback((e) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      setVolume(val)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 如果用户在输入框中，忽略键盘事件
      if (e.target.tagName === "INPUT" || 
          e.target.tagName === "TEXTAREA" || 
          e.target.isContentEditable) {
        return
      }

      // 处理音量控制
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        setVolume(v => Math.max(0, v - VOLUME_STEP))
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        setVolume(v => Math.min(1, v + VOLUME_STEP))
      }

      // 处理 pad 切换
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        const padId = parseInt(e.key, 10)
        if (padId >= 1 && padId <= pads.length) {
          e.preventDefault()
          toggle(padId)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggle, pads])

  const buttonElements = pads.map(pad =>
    <Pad
      key={pad.id}
      id={pad.id}
      color={pad.color}
      on={pad.on}
      toggle={toggle}
      sound={pad.sound}
      volume={volume}
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
      </div>
    </main>
  )
}