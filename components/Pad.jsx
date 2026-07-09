import { useRef, useEffect } from "react"
export default function Pad({id, color, on, toggle, sound, volume}) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      if (on) {
        playSound()
      } else {
        stopSound()
      }
    } 
  }, [on])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume ?? 1
    }
  }, [volume])

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(err => console.error("Playback error:", err))
    }
  }

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const handlePadClick = () => {
    if (on) {
      toggle(id)
      stopSound()
    } else {
      toggle(id)
      playSound()
    }
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
      />
    </>
  )
}