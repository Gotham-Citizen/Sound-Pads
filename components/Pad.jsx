import { useRef, useEffect, useCallback } from "react"
export default function Pad({id, color, on, toggle, sound, volume, isCustom, label, onDelete, index, onReorder}) {
  const audioRef = useRef(null)

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(err => console.error("Playback error:", err))
    }
  }, [])

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (on) {
        playSound()
      } else {
        stopSound()
      }
    }
  }, [on, playSound, stopSound])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume ?? 1
    }
  }, [volume])

  const handlePadClick = () => {
    toggle(id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (on) {
      toggle(id)
    }
    onDelete(id)
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", String(index))
    e.dataTransfer.effectAllowed = "move"
    e.currentTarget.classList.add("dragging")
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    const target = e.currentTarget
    if (!target.classList.contains("drag-over")) {
      target.classList.add("drag-over")
    }
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over")
  }

  const handlePadDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove("drag-over", "dragging")
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10)
    if (!isNaN(fromIndex) && fromIndex !== index) {
      onReorder(fromIndex, index)
    }
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging")
  }

  const styles = {
    backgroundColor: color
  }

  return (
    <>
      <audio ref={audioRef} src={sound} preload="auto" />
      <button
        key={id}
        className={on ? "on" : ""}
        style={styles}
        onClick={handlePadClick}
        data-key={id}
        title={label || ""}
        draggable={isCustom || false}
        onDragStart={isCustom ? handleDragStart : undefined}
        onDragOver={isCustom ? handleDragOver : undefined}
        onDragLeave={isCustom ? handleDragLeave : undefined}
        onDrop={isCustom ? handlePadDrop : undefined}
        onDragEnd={isCustom ? handleDragEnd : undefined}
      >
        {label && <span className="pad-label" draggable={false}>{label}</span>}
        {isCustom && <span className="delete-btn" onClick={handleDelete} title="Delete pad" draggable={false}>&times;</span>}
      </button>
    </>
  )
}