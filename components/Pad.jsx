import { useRef, useEffect, useCallback } from "react"

let dragSourceIndex = null
let dragStartX = 0
let dragStartY = 0
let isDragging = false
const DRAG_THRESHOLD = 5

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
    if (isDragging) return
    toggle(id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (on) {
      toggle(id)
    }
    onDelete(id)
  }

  const handlePointerDown = (e) => {
    if (!isCustom || e.button !== 0) return
    dragSourceIndex = index
    dragStartX = e.clientX
    dragStartY = e.clientY
    isDragging = false
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (dragSourceIndex !== index) return
    const dx = e.clientX - dragStartX
    const dy = e.clientY - dragStartY
    if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      isDragging = true
      e.currentTarget.style.pointerEvents = "none"
      e.currentTarget.classList.add("dragging")
    }
    if (!isDragging) return
    e.preventDefault()
    e.currentTarget.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`
    e.currentTarget.style.zIndex = "1000"
    const element = document.elementFromPoint(e.clientX, e.clientY)
    const button = element?.closest?.("button[data-index]")
    document.querySelectorAll("button.drag-over").forEach(el => el.classList.remove("drag-over"))
    if (button && parseInt(button.dataset.index) !== dragSourceIndex) {
      button.classList.add("drag-over")
    }
  }

  const handlePointerUp = (e) => {
    if (dragSourceIndex !== index) return
    document.querySelectorAll("button.dragging, button.drag-over").forEach(el => el.classList.remove("dragging", "drag-over"))
    e.currentTarget.style.transform = ""
    e.currentTarget.style.zIndex = ""
    e.currentTarget.style.pointerEvents = ""

    if (isDragging) {
      const element = document.elementFromPoint(e.clientX, e.clientY)
      const button = element?.closest?.("button[data-index]")
      if (button) {
        const toIndex = parseInt(button.dataset.index)
        if (!isNaN(toIndex) && toIndex !== dragSourceIndex) {
          onReorder(dragSourceIndex, toIndex)
        }
      }
    }

    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}

    dragSourceIndex = null
    setTimeout(() => { isDragging = false }, 0)
  }

  const handlePointerCancel = (e) => {
    if (dragSourceIndex !== index) return
    document.querySelectorAll("button.dragging, button.drag-over").forEach(el => el.classList.remove("dragging", "drag-over"))
    e.currentTarget.style.transform = ""
    e.currentTarget.style.zIndex = ""
    e.currentTarget.style.pointerEvents = ""
    dragSourceIndex = null
    isDragging = false
  }

  const styles = {
    backgroundColor: color,
    touchAction: isCustom ? "none" : undefined,
    cursor: isCustom ? "grab" : undefined
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
        data-index={index}
        title={label || ""}
        onPointerDown={isCustom ? handlePointerDown : undefined}
        onPointerMove={isCustom ? handlePointerMove : undefined}
        onPointerUp={isCustom ? handlePointerUp : undefined}
        onPointerCancel={isCustom ? handlePointerCancel : undefined}
      >
        {label && <span className="pad-label" draggable={false}>{label}</span>}
        {isCustom && <span className="delete-btn" onClick={handleDelete} onPointerDown={e => e.stopPropagation()} title="Delete pad" draggable={false}>&times;</span>}
      </button>
    </>
  )
}
