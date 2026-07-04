import { useRef, useEffect } from "react"

export default function Pad({id, color, on, toggle, sound, keyChar, volume}) {
  const audioRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!on && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [on])

  const handleClick = () => {
    if (on) {
      toggle(id)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    } else {
      toggle(id)
      playSound()
    }
  }

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.volume = volume
      audioRef.current.play().catch(err => console.error("Playback error:", err))
    }
    
    if (buttonRef.current) {
      buttonRef.current.classList.add("clicked")
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.classList.remove("clicked")
        }
      }, 150)
    }
  }

  const styles = {
    backgroundColor: color
  }

  return (
    <>
      <audio ref={audioRef} src={sound} preload="auto" />
      <button 
        ref={buttonRef}
        key={id} 
        className={on ? "on" : ""} 
        style={styles} 
        onClick={handleClick}
        data-key={keyChar}
      >
        {keyChar}
      </button>
    </>
  )
}